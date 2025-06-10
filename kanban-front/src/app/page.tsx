import Link from "next/link";
import { Button } from "antd";

export default function Home() {
  return (
    <>
      <main>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md">
          <Link href="/users">
            <Button type="primary" size="large" block>
              Utilisateurs
            </Button>
          </Link>
          <Link href="/kanban">
            <Button type="primary" size="large" block>
              Tableau Kanban
            </Button>
          </Link>
        </div>
      </main>
      <footer className="mt-8">
        <p>© 2025 - Tous droits réservés</p>
      </footer>
    </>
  );
}
