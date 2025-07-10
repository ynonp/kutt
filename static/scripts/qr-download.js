// QR Code Download Functionality
// Functions to add download capabilities for QR codes in PNG and SVG formats

// Add download buttons to QR code container
function addQRDownloadButtons(container, url) {
  const buttonContainer = document.createElement("div");
  buttonContainer.style.marginTop = "20px";
  buttonContainer.style.display = "flex";
  buttonContainer.style.gap = "10px";
  buttonContainer.style.justifyContent = "center";
  
  const downloadPngBtn = document.createElement("button");
  downloadPngBtn.textContent = "Download PNG";
  downloadPngBtn.className = "button";
  downloadPngBtn.onclick = () => downloadQRCode(container, url, 'png');
  
  const downloadSvgBtn = document.createElement("button");
  downloadSvgBtn.textContent = "Download SVG";
  downloadSvgBtn.className = "button";
  downloadSvgBtn.onclick = () => downloadQRCode(container, url, 'svg');
  
  buttonContainer.appendChild(downloadPngBtn);
  buttonContainer.appendChild(downloadSvgBtn);
  
  return buttonContainer;
}

// Download QR code in specified format
function downloadQRCode(container, url, format) {
  if (format === 'png') {
    // For PNG, find the canvas element and convert to blob
    const canvas = container.querySelector('canvas');
    if (canvas) {
      canvas.toBlob(function(blob) {
        const link = document.createElement('a');
        link.download = 'qrcode.png';
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
      }, 'image/png');
    }
  } else if (format === 'svg') {
    // Create a temporary container for SVG generation
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '-9999px';
    document.body.appendChild(tempContainer);
    
    // Check if we already have an SVG in the current container
    const existingSvg = container.querySelector('svg');
    if (existingSvg) {
      // Use existing SVG
      const svgData = new XMLSerializer().serializeToString(existingSvg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml' });
      
      const link = document.createElement('a');
      link.download = 'qrcode.svg';
      link.href = URL.createObjectURL(svgBlob);
      link.click();
      URL.revokeObjectURL(link.href);
    } else {
      // Create new QR code specifically for SVG
      // Force SVG rendering by temporarily modifying the document
      const originalTagName = document.documentElement.tagName;
      try {
        // This is a hack to force the QR code library to use SVG
        Object.defineProperty(document.documentElement, 'tagName', {
          get: function() { return 'svg'; },
          configurable: true
        });
        
        const svgQrcode = new QRCode(tempContainer, {
          text: url,
          width: 200,
          height: 200,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H
        });
        
        // Wait a moment for the QR code to be generated
        setTimeout(() => {
          const svgElement = tempContainer.querySelector('svg');
          if (svgElement) {
            const svgData = new XMLSerializer().serializeToString(svgElement);
            const svgBlob = new Blob([svgData], { type: 'image/svg+xml' });
            
            const link = document.createElement('a');
            link.download = 'qrcode.svg';
            link.href = URL.createObjectURL(svgBlob);
            link.click();
            URL.revokeObjectURL(link.href);
          } else {
            // Fallback: convert canvas to SVG
            const canvas = tempContainer.querySelector('canvas');
            if (canvas) {
              convertCanvasToSVG(canvas, url);
            }
          }
          
          // Clean up
          document.body.removeChild(tempContainer);
        }, 100);
        
      } finally {
        // Restore original tagName
        Object.defineProperty(document.documentElement, 'tagName', {
          get: function() { return originalTagName; },
          configurable: true
        });
      }
    }
  }
}

// Convert canvas to SVG as fallback
function convertCanvasToSVG(canvas, url) {
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
  // Create SVG
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '200');
  svg.setAttribute('height', '200');
  svg.setAttribute('viewBox', `0 0 ${canvas.width} ${canvas.height}`);
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  
  // Create white background
  const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  background.setAttribute('width', '100%');
  background.setAttribute('height', '100%');
  background.setAttribute('fill', 'white');
  svg.appendChild(background);
  
  // Convert pixels to SVG rectangles
  const moduleSize = Math.floor(canvas.width / 25); // Approximate module size
  
  for (let y = 0; y < canvas.height; y += moduleSize) {
    for (let x = 0; x < canvas.width; x += moduleSize) {
      const pixelIndex = (Math.floor(y) * canvas.width + Math.floor(x)) * 4;
      const r = imageData.data[pixelIndex];
      const g = imageData.data[pixelIndex + 1];
      const b = imageData.data[pixelIndex + 2];
      
      // If pixel is dark (close to black), create a rectangle
      if (r < 128 && g < 128 && b < 128) {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x);
        rect.setAttribute('y', y);
        rect.setAttribute('width', moduleSize);
        rect.setAttribute('height', moduleSize);
        rect.setAttribute('fill', 'black');
        svg.appendChild(rect);
      }
    }
  }
  
  // Download SVG
  const svgData = new XMLSerializer().serializeToString(svg);
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml' });
  
  const link = document.createElement('a');
  link.download = 'qrcode.svg';
  link.href = URL.createObjectURL(svgBlob);
  link.click();
  URL.revokeObjectURL(link.href);
}