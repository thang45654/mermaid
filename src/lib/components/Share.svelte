<script lang="ts">
  import { buttonVariants, Button } from '$/components/ui/button';
  import * as Dialog from '$/components/ui/dialog';
  import { Separator } from '$/components/ui/separator';
  import { env } from '$/util/env';
  import { urlsStore } from '$/util/state';
  import { asset } from '$app/paths';
  import LinkIcon from '~icons/material-symbols/link';
  import ShareIcon from '~icons/material-symbols/share';
  import CopyInput from './CopyInput.svelte';
  import MermaidChartIcon from './MermaidChartIcon.svelte';

  let shortenedUrl = $state('');
  let isShortening = $state(false);
  let shortenError = $state('');

  const isLocalhost = () =>
    ['localhost', '127.0.0.1', '0.0.0.0'].includes(window.location.hostname);

  const shortenUrl = async () => {
    if (isLocalhost()) {
      shortenError = 'URL shortener không hoạt động trên localhost. Hãy thử sau khi deploy.';
      return;
    }
    isShortening = true;
    shortenError = '';
    shortenedUrl = '';
    try {
      const res = await fetch(
        `https://is.gd/create.php?format=json&url=${encodeURIComponent(window.location.href)}`
      );
      const data = await res.json();
      if (data.shorturl) {
        shortenedUrl = data.shorturl;
      } else {
        shortenError = data.errormessage ?? 'Không thể rút gọn URL.';
      }
    } catch {
      shortenError = 'Lỗi kết nối tới is.gd.';
    } finally {
      isShortening = false;
    }
  };
</script>

<Dialog.Root>
  <Dialog.Trigger class={buttonVariants({ size: 'sm' })}>Share</Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title class="flex items-center gap-2 text-xl">
        <ShareIcon class="size-5" /> Shareable links
      </Dialog.Title>
      <Dialog.Description>Share your diagrams with others.</Dialog.Description>
    </Dialog.Header>

    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <h2 class="flex items-center gap-2">
          <img class="size-5" src={asset('/favicon.svg')} alt="Mermaid Live Editor" />
          Mermaid Live Editor
        </h2>
        <CopyInput value={window.location.href} />
        <Dialog.Description>
          The content of the diagrams you create never leaves your browser.
        </Dialog.Description>
      </div>

      <Separator />
      <div class="flex flex-col gap-2">
        <h2 class="flex items-center gap-2">
          <LinkIcon class="size-5" />
          Shorten URL
        </h2>
        <Button variant="outline" onclick={shortenUrl} disabled={isShortening}>
          {isShortening ? 'Đang rút gọn...' : 'Tạo short URL'}
        </Button>
        {#if shortenedUrl}
          <CopyInput value={shortenedUrl} />
        {/if}
        {#if shortenError}
          <p class="text-sm text-destructive">{shortenError}</p>
        {/if}
      </div>
      {#if env.isEnabledMermaidChartLinks}
        <Separator />
        <div class="flex flex-col gap-2">
          <h2 class="flex items-center gap-2">
            <MermaidChartIcon class="size-5" />
            Mermaid Chart Playground
          </h2>
          <CopyInput value={$urlsStore.mermaidChart({ medium: 'share' }).playground} />
          <Dialog.Description>
            Opens the Mermaid Chart Playground with Mermaid AI, Visual Editor, and more.
          </Dialog.Description>
        </div>
      {/if}
    </div>
  </Dialog.Content>
</Dialog.Root>
