import { NextResponse } from "next/server";
import { serverFetch, ApiError } from "@/src/lib/backendClient";

export async function GET(
  request: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  const backendPath = params.path.join("/");
  try {
    const res = await serverFetch(backendPath, { method: "GET" });
    console.log(`[proxy] forwarding to ${res.url} -> status ${res.status}`);
    return NextResponse.json(res.data, { status: res.status });
  } catch (err) {
    if (err instanceof ApiError) {
      console.error("[proxy] GET error", {
        url: err.url,
        status: err.status,
        message: err.message,
        data: err.data
      });
      return NextResponse.json(
        { error: err.message, data: err.data },
        { status: err.status }
      );
    }
    console.error("[proxy] GET unknown error", err);
    return NextResponse.json({ error: "Unknown proxy error" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  const backendPath = params.path.join("/");
  const body = await request.text();
  try {
    console.log(`[proxy] POST -> ${backendPath}`);
    const res = await serverFetch(backendPath, {
      method: "POST",
      body,
      headers: {
        "content-type":
          request.headers.get("content-type") || "application/json"
      }
    });
    console.log(`[proxy] forwarding to ${res.url} -> status ${res.status}`);
    return NextResponse.json(res.data, { status: res.status });
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json(
        { error: err.message, data: err.data },
        { status: err.status }
      );
    }
    return NextResponse.json({ error: "Unknown proxy error" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  const backendPath = params.path.join("/");
  const body = await request.text();
  try {
    console.log(`[proxy] PUT -> ${backendPath}`);
    const res = await serverFetch(backendPath, {
      method: "PUT",
      body,
      headers: {
        "content-type":
          request.headers.get("content-type") || "application/json"
      }
    });
    console.log(`[proxy] forwarding to ${res.url} -> status ${res.status}`);
    return NextResponse.json(res.data, { status: res.status });
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json(
        { error: err.message, data: err.data },
        { status: err.status }
      );
    }
    return NextResponse.json({ error: "Unknown proxy error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  const backendPath = params.path.join("/");
  try {
    console.log(`[proxy] DELETE -> ${backendPath}`);
    const res = await serverFetch(backendPath, { method: "DELETE" });
    console.log(`[proxy] forwarding to ${res.url} -> status ${res.status}`);
    return NextResponse.json(res.data, { status: res.status });
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json(
        { error: err.message, data: err.data },
        { status: err.status }
      );
    }
    return NextResponse.json({ error: "Unknown proxy error" }, { status: 500 });
  }
}
