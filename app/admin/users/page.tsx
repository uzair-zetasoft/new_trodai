import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Role } from "@/lib/constants";
import UsersClient from "./components/UsersClient";

// This component will be used to update the localStorage with user data
// on the client side when the page is loaded
const UserDataUpdater = ({ userData }: { userData: string }) => {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          try {
            localStorage.setItem('userData', '${userData.replace(/'/g, "\\'")}');
          } catch (e) {
            console.error('Failed to update userData:', e);
          }
        `,
      }}
    />
  );
};

// Server Component to check auth
async function UsersWithAuth() {
  const session = await auth();
  
  // Check authentication
  if (!session?.user) {
    redirect("/login");
  }
  
  // If not admin, redirect to unauthorized
  if (session.user.role !== Role.ADMIN) {
    redirect("/unauthorized");
  }
  
  // Prepare user data for client components
  const userData = JSON.stringify({
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: session.user.role
  });
  
  // If authenticated as admin, render the actual admin dashboard
  return (
    <>
      <UserDataUpdater userData={userData} />
      <UsersClient />
    </>
  );
}

// Main page component - this will be the default export
export default async function UsersPage() {
  return <UsersWithAuth />;
} 