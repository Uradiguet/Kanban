import Link from "next/link";Add commentMore actions
import {Button} from "antd";

export default function Home() {
  return (
    <>
    <main>
      <Link href={"/users"}>
        <Button type="primary">Utilisateurs</Button>
      </Link>
    </main>
      <footer>
        <p>© 2025 - Tous droits réservés</p>
      </footer>
    </>
  );
}