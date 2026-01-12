export function genUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const PUBLIC_ROUTERS = ['/sign-in', '/sign-up', '/landing', '/verify-email'];

export const detectLanguage = (content: string = ''): string => {
  const code = content?.trim();

  if (!code) return 'text';

  if (/^<!DOCTYPE html>/i.test(code) || /<\/?[a-z][\s\S]*>/i.test(code)) {
    return 'html';
  }

  if (/^[a-z0-9\s.#\-_]+\{[^}]+}/i.test(code) && !/(=>|\$)/.test(code)) {
    return 'css';
  }

  if (
    /def\s+\w+/.test(code) ||
    /if\s+__name__\s*==\s*['"]__main__['"]:/.test(code) ||
    /import\s+[\w.]+\s+as\s+\w+/.test(code) ||
    /from\s+[\w.]+\s+import/.test(code) ||
    (/print\s*\(/.test(code) && !/;/g.test(code) && !/\{/.test(code))
  ) {
    return 'python';
  }

  if (
    /\b(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER)\b/i.test(code) &&
    /\b(FROM|INTO|TABLE|WHERE|VALUES)\b/i.test(code)
  ) {
    return 'sql';
  }

  if (code.startsWith('#!') || /\b(sudo|npm|yarn|docker|git|ls|cd|echo)\b/.test(code)) {
    return 'bash';
  }

  if (
    (code.startsWith('{') && code.endsWith('}')) ||
    (code.startsWith('[') && code.endsWith(']'))
  ) {
    if (/"\w+"\s*:/.test(code)) return 'json';
  }

  if (
    /package\s+main/.test(code) ||
    /func\s+\w+\(/.test(code) ||
    /fmt\.P/.test(code) ||
    /:=\s/.test(code)
  ) {
    return 'go';
  }

  if (
    /#include\s+<[\w.]+>/.test(code) ||
    /std::/.test(code) ||
    /cout\s*<</.test(code) ||
    /int\s+main\s*\(/.test(code)
  ) {
    return 'cpp';
  }

  if (
    /public\s+class/.test(code) ||
    /System\.out/.test(code) ||
    /public\s+static\s+void/.test(code) ||
    /ArrayList<|List</.test(code)
  ) {
    return 'java';
  }

  if (
    /import\s+.*\s+from/.test(code) ||
    /export\s+(default|const|class|function)/.test(code) ||
    /const\s+\w+/.test(code) ||
    /let\s+\w+/.test(code) ||
    /console\.log/.test(code) ||
    /=>/.test(code) ||
    /interface\s+\w+/.test(code) ||
    /<\w+\s*\/>/.test(code)
  ) {
    return 'tsx';
  }

  if (
    /\b(if|while|for|switch|catch)\s*\(/.test(code) ||
    /\{[\s\S]*\}/.test(code) ||
    /(\+\+|--|&&|\|\||===|!==)/.test(code)
  ) {
    return 'java';
  }

  return 'text';
};

export const getDateLabel = (dateStr: string, t: (key: string) => string): string => {
  const [day, month, year] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  today.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  if (date.getTime() === today.getTime()) {
    return t('today');
  }
  if (date.getTime() === yesterday.getTime()) {
    return t('yesterday');
  }
  return dateStr;
};

export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', error => reject(error));
    image.setAttribute('crossOrigin', 'anonymous'); // needed to avoid cross-origin issues on CodeSandbox
    image.src = url;
  });

export function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}

export function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = getRadianAngle(rotation);

  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

export async function getCroppedImg(
  imageSrc: string | null | undefined,
  pixelCrop: { x: number; y: number; width: number; height: number },
  rotation = 0,
  flip = { horizontal: false, vertical: false },
  circular = false,
): Promise<string | null> {
  if (!imageSrc || !pixelCrop || pixelCrop.width <= 0 || pixelCrop.height <= 0) {
    return null;
  }

  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  const rotRad = getRadianAngle(rotation);

  // calculate bounding box of the rotated image
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(image.width, image.height, rotation);

  // set canvas size to match the bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // translate canvas context to a central location to allow rotating and flipping around the center
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);

  // draw rotated image
  ctx.drawImage(image, 0, 0);

  const pixelCropX = Math.round(pixelCrop.x ?? 0);
  const pixelCropY = Math.round(pixelCrop.y ?? 0);
  const pixelCropWidth = Math.round(pixelCrop.width ?? 0);
  const pixelCropHeight = Math.round(pixelCrop.height ?? 0);

  if (
    Number.isNaN(pixelCropX) ||
    Number.isNaN(pixelCropY) ||
    Number.isNaN(pixelCropWidth) ||
    Number.isNaN(pixelCropHeight) ||
    pixelCropWidth <= 0 ||
    pixelCropHeight <= 0
  ) {
    return null;
  }

  const data = ctx.getImageData(pixelCropX, pixelCropY, pixelCropWidth, pixelCropHeight);

  // Create a temporary canvas to hold the cropped image data
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = pixelCropWidth;
  tempCanvas.height = pixelCropHeight;
  const tempCtx = tempCanvas.getContext('2d');

  if (!tempCtx) {
    return null;
  }

  // Put the cropped image data into temp canvas
  tempCtx.putImageData(data, 0, 0);

  // set canvas width to final desired crop size - this will clear existing context
  canvas.width = pixelCropWidth;
  canvas.height = pixelCropHeight;

  if (circular) {
    // For circular crop, create a clipping path
    const centerX = pixelCropWidth / 2;
    const centerY = pixelCropHeight / 2;
    const radius = Math.min(pixelCropWidth, pixelCropHeight) / 2;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.clip();

    // Draw the cropped image from temp canvas into the circular clip
    ctx.drawImage(tempCanvas, 0, 0);
  } else {
    // For rectangular crop, just paste the image data
    ctx.putImageData(data, 0, 0);
  }

  // As Base64 string
  // return canvas.toDataURL('image/jpeg');

  // As a blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(file => {
      if (file) {
        resolve(URL.createObjectURL(file));
      } else {
        reject(new Error('Canvas is empty'));
      }
    }, 'image/jpeg');
  });
}

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/avif',
];
