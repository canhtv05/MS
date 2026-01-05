import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  return handleRequest(request);
}

export async function POST(request: NextRequest) {
  return handleRequest(request);
}

export async function PUT(request: NextRequest) {
  return handleRequest(request);
}

export async function DELETE(request: NextRequest) {
  return handleRequest(request);
}

export async function PATCH(request: NextRequest) {
  return handleRequest(request);
}

async function handleRequest(request: NextRequest) {
  try {
    // Get the path after /api/proxy/
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/api/proxy/')[1] || '';

    // Get backend URL from environment variable or default
    const backendUrl = process.env.NEXT_PUBLIC_API_BACKEND_URL || 'http://localhost:1000/api/v1';

    // Construct the target URL
    const targetUrl = `${backendUrl}/${pathSegments}${url.search}`;

    console.log('[API Proxy] Request:', {
      method: request.method,
      path: pathSegments,
      targetUrl,
    });

    // Get request headers
    const headers = new Headers(request.headers);

    // Remove host header to avoid conflicts
    headers.delete('host');

    // Add ngrok bypass header if using ngrok
    if (backendUrl.includes('ngrok')) {
      headers.set('ngrok-skip-browser-warning', 'true');
    }

    // Prepare request options
    const requestOptions: RequestInit = {
      method: request.method,
      headers,
    };

    // Add body for POST, PUT, PATCH requests
    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
      const contentType = request.headers.get('content-type');

      if (contentType?.includes('multipart/form-data')) {
        // For FormData, pass it directly
        requestOptions.body = await request.blob();
      } else if (contentType?.includes('application/json')) {
        // For JSON, parse and re-stringify
        try {
          const body = await request.json();
          requestOptions.body = JSON.stringify(body);
        } catch {
          // If parsing fails, use text
          requestOptions.body = await request.text();
        }
      } else {
        // For other content types
        requestOptions.body = await request.text();
      }
    }

    // Make the proxy request
    const response = await fetch(targetUrl, requestOptions);

    // Get response body
    const responseText = await response.text();

    // Create response headers
    const responseHeaders = new Headers();

    // Copy relevant headers from backend response
    ['content-type', 'cache-control', 'set-cookie'].forEach(header => {
      const value = response.headers.get(header);
      if (value) {
        responseHeaders.set(header, value);
      }
    });

    // Add CORS headers
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    console.log('[API Proxy] Response:', {
      status: response.status,
      statusText: response.statusText,
    });

    // Return the response
    return new NextResponse(responseText, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('[API Proxy] Error:', error);

    return NextResponse.json(
      {
        error: 'Proxy request failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
