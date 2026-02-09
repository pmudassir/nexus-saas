import { Shell } from "@/components/layout/Shell";
import { TasksClient } from "@/components/tasks/TasksClient";
import { 
  getAllTenantTasks, 
  getProjectsForTasks, 
  getTeamMembersForTasks,
  getTaskStats 
} from "@/actions/tasks";
import { auth } from "@/auth";

export default async function TasksPage() {
  const session = await auth();
  const userName = session?.user?.name || "User";

  // Fetch all data in parallel
  const [tasks, projects, teamMembers, stats] = await Promise.all([
    getAllTenantTasks(),
    getProjectsForTasks(),
    getTeamMembersForTasks(),
    getTaskStats(),
  ]);

  return (
    <Shell>
      <TasksClient
        initialTasks={tasks}
        projects={projects}
        teamMembers={teamMembers}
        stats={stats}
        userName={userName}
      />
    </Shell>
  );
}
