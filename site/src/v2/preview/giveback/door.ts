/*
 * Stage 'door-bug': the door page's header for Friday after Ana gave back her spot, in the door
 * app's dark night palette. The count still holds her +1: one too high. A helper found it; the
 * page marks that line and shows the sum.
 */
import { EXPECTED_BEFORE } from './data';
import { ICON } from './icons';

const CAPACITY = 220;

export function doorBugHtml(): string {
  const should = EXPECTED_BEFORE - 2;
  const shows = EXPECTED_BEFORE - 1;
  return `
  <div class="gb-door">
    <div class="gb-dcol">
      <header class="gb-dhead">
        <div class="gb-dbrand">
          <span class="gb-dlantern">${ICON.lantern}</span>
          <span class="gb-dbrand-text"><b>The Lantern</b><span>Door · Fri 28 Nov</span></span>
        </div>
        <div class="gb-dexp">
          <span class="gb-dexp-label">Expected tonight</span>
          <b class="gb-dexp-n" data-bad>${shows}</b>
        </div>
      </header>
      <div class="gb-dcap" aria-hidden="true"><i style="transform:scaleX(${(shows / CAPACITY).toFixed(3)})"></i></div>

      <section class="gb-dcard" aria-labelledby="gb-dchanged">
        <h2 class="gb-dh" id="gb-dchanged">What changed <span>Mon 10:04</span></h2>
        <ol class="gb-dlist">
          <li class="gb-dch">
            <span class="gb-dav" aria-hidden="true">AL</span>
            <span class="gb-dwho"><b>Ana Lopez</b><span><i class="gb-ddot"></i>Kai’s list · gave back</span></span>
            <span class="gb-dd">−1</span>
          </li>
          <li class="gb-dch" data-bad>
            <span class="gb-dav" aria-hidden="true">+1</span>
            <span class="gb-dwho"><b>Ana’s +1</b><span><i class="gb-ddot"></i>still counted</span></span>
            <span class="gb-dd">0</span>
            <span class="gb-found">${ICON.flag}found by a helper: +1 still counted</span>
          </li>
        </ol>
      </section>

      <section class="gb-dcard" aria-labelledby="gb-dsum">
        <h2 class="gb-dh" id="gb-dsum">The count</h2>
        <dl class="gb-dsum">
          <div><dt>Expected before</dt><dd>${EXPECTED_BEFORE}</dd></div>
          <div><dt>Ana Lopez gave back</dt><dd>−1</dd></div>
          <div><dt>Her +1</dt><dd>−1</dd></div>
          <div class="gb-dsum-total"><dt>Should be</dt><dd>${should}</dd></div>
          <div class="gb-dsum-bad"><dt>Page shows</dt><dd>${shows} <span>1 too high</span></dd></div>
        </dl>
      </section>
    </div>
  </div>`;
}
