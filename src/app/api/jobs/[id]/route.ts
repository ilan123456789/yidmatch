import { NextResponse } from "next/server";
import { getJobById, updateJob, getApplications } from "@/lib/db";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const job = await getJobById(params.id);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const applications = await getApplications({ jobId: params.id });

    return NextResponse.json({ job, applicationCount: applications.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch job" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const updated = await updateJob(params.id, body);
    if (!updated) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }
    return NextResponse.json({ job: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update job" }, { status: 500 });
  }
}
