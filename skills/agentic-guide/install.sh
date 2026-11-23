#!/usr/bin/env bash
# Install the agentic-guide skill for Claude Code and Codex. For macOS and Linux.
# (On Windows, ask your agent to copy this folder into the same two places.)
#
#   install.sh                 into this project: ./.claude/skills and ./.agents/skills
#   install.sh --project       the same (the default)
#   install.sh --global        for every project in Claude Code and Codex: ~/.claude/skills and ~/.agents/skills
#   install.sh --dir PATH      into the project at PATH instead of the current folder
#   install.sh --copy          copy the files (the default)
#   install.sh --link          symlink to this folder instead of copying (for editing the skill)
#   install.sh -h, --help      show this help
#
# Run it again at any time: it replaces only an earlier agentic-guide install and touches
# nothing else. Anything else in its way, including a symlink to something else, is reported
# as a conflict and left alone.
set -euo pipefail

NAME="agentic-guide"
SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
scope="project"
mode="copy"
dir="$PWD"
dir_given=0

usage() { sed -n '2,15p' "$0" | sed 's/^# \{0,1\}//'; }

# True when the folder holds a SKILL.md whose frontmatter says "name: agentic-guide".
is_guide() {
  [ -f "$1/SKILL.md" ] || return 1
  awk -v want="$NAME" '
    { sub(/\r$/, "") }
    NR == 1 { if ($0 != "---") exit 1; next }
    $0 == "---" { exit 1 }
    $0 == "name: " want { found = 1; exit 0 }
    END { exit found ? 0 : 1 }
  ' "$1/SKILL.md"
}

while [ $# -gt 0 ]; do
  case "$1" in
    --global) scope="global" ;;
    --project) scope="project" ;;
    --dir) shift; [ $# -gt 0 ] || { echo "--dir needs a path" >&2; exit 2; }; dir="$1"; dir_given=1 ;;
    --link) mode="link" ;;
    --copy) mode="copy" ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown option: $1" >&2; usage >&2; exit 2 ;;
  esac
  shift
done

if [ "$scope" = "global" ] && [ "$dir_given" -eq 1 ]; then
  echo "--dir and --global don't go together: --global installs into your home folder." >&2
  echo "Use --dir PATH for one project, or --global for every project." >&2
  exit 2
fi

if ! is_guide "$SRC"; then
  echo "This script must sit in the $NAME skill folder, next to its SKILL.md." >&2
  exit 1
fi

if [ "$scope" = "global" ]; then
  base="$HOME"
else
  [ -d "$dir" ] || { echo "No such folder: $dir" >&2; exit 1; }
  base="$(cd "$dir" && pwd -P)"
  if [ "$base" = "$(cd "$HOME" && pwd -P)" ]; then
    echo "This is your home folder. Run it inside a project folder, or use --global." >&2
    exit 1
  fi
fi

targets=("$base/.claude/skills/$NAME" "$base/.agents/skills/$NAME")

done_list=()
skipped=0
conflict() {
  echo "Conflict:        $1 $2. Left alone; move it away and run again." >&2
  skipped=1
}

for dest in "${targets[@]}"; do
  if [ -L "$dest" ]; then
    # A symlink: replace it only when it points at an agentic-guide skill folder.
    target="$(cd "$dest" 2>/dev/null && pwd -P || true)"
    if [ -z "$target" ]; then
      conflict "$dest" "is a symlink to $(readlink "$dest"), which does not exist"
      continue
    fi
    if ! is_guide "$target"; then
      conflict "$dest" "is a symlink to $target, which is not an $NAME install"
      continue
    fi
    if [ "$mode" = "link" ] && [ "$target" = "$SRC" ]; then
      echo "Already linked:  $dest"
      done_list+=("$dest")
      continue
    fi
    rm "$dest"
  elif [ -d "$dest" ] && [ "$(cd "$dest" && pwd -P)" = "$SRC" ]; then
    # The script runs from this installed copy: it is already in place.
    echo "Already here:    $dest (the copy this script runs from)"
    done_list+=("$dest")
    continue
  elif [ -e "$dest" ]; then
    # Replace only an earlier install of this skill, never anything else.
    if [ -d "$dest" ] && is_guide "$dest"; then
      rm -rf "$dest"
    else
      conflict "$dest" "exists and is not an $NAME install"
      continue
    fi
  fi

  mkdir -p "$(dirname "$dest")"
  if [ "$mode" = "link" ]; then
    ln -s "$SRC" "$dest"
    echo "Linked:          $dest -> $SRC"
  else
    mkdir "$dest"
    cp -R "$SRC"/. "$dest"/
    echo "Copied:          $dest"
  fi
  done_list+=("$dest")
done

if [ "${#done_list[@]}" -eq 0 ]; then
  echo
  echo "Nothing was installed."
  exit 1
fi

echo
echo "How to check it worked:"
if [ "${#done_list[@]}" -eq 1 ]; then
  echo "  1. This folder holds a SKILL.md:"
else
  echo "  1. These folders hold a SKILL.md:"
fi
for dest in "${done_list[@]}"; do echo "       ls \"$dest/SKILL.md\""; done
if [ "$scope" = "global" ]; then
  echo "  2. In T3 Code, start a new thread in any project and type \$ in the message box."
else
  echo "  2. In T3 Code, start a new thread in this project ($base) and type \$ in the message box."
fi
echo "     A list opens: pick agentic-guide, then press Enter to send."
echo "     (A thread that was already open needs Restart agent session from the command palette first.)"
echo "  Outside T3 Code: /agentic-guide in Claude Code, \$agentic-guide in Codex."
if [ "$scope" = "project" ] && ! git -C "$base" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo
  echo "Note: $base is not a Git repository. With 'git init' and a commit, Git keeps a snapshot of"
  echo "your files: later changes to them can be put back. Files created after the snapshot are not"
  echo "in it, and removing them is a separate step."
fi
exit "$skipped"
