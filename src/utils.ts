import useClipboard from "vue-clipboard3";
const { toClipboard } = useClipboard();

/**
 * 复制内容到粘贴板
 * @param text 内容
 */
export async function copyText(text: string) {
  try {
    await toClipboard(text);
    alert("Copied to clipboard");
  } catch (e) {
    alert(e);
  }
}
