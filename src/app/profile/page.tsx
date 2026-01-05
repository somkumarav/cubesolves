import { SolveTable } from "@/components/profile/solve-table/data-table";
import { columns } from "@/components/profile/solve-table/columns";
import {
  getAllSolveSession,
  getSolveSessionSolves,
} from "@/actions/solve-session";

export default async function ProfilePage() {
  const solveSession = await getAllSolveSession();
  if (!solveSession.status || !solveSession.additional) return null;
  const data = await getSolveSessionSolves({
    solveSessionId: solveSession.additional[0].id,
  });

  if (!data.status || !data.additional) return null;

  return (
    <div className='h-[90vh] overflow-y-scroll'>
      <SolveTable columns={columns} data={data.additional.solves} />
    </div>
  );
}
