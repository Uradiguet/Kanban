import Link from "next/link";
import { Button, Card, Row, Col } from "antd";
import { UserOutlined, ProjectOutlined } from '@ant-design/icons';

export default function Home() {
  return (
    <>
      <main className="space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Bienvenue dans votre espace Kanban
          </h1>
          <p className="text-gray-600 text-lg">
            Gérez vos projets et équipes de manière efficace
          </p>
        </div>

        <Row gutter={[24, 24]} justify="center">
          <Col xs={24} sm={12} md={8}>
            <Card
              hoverable
              className="text-center h-full"
              cover={
                <div className="p-8 bg-gradient-to-br from-blue-50 to-blue-100">
                  <ProjectOutlined className="text-6xl text-blue-500" />
                </div>
              }
            >
              <Card.Meta
                title="Tableau Kanban"
                description="Visualisez et gérez vos tâches avec le système Kanban"
              />
              <div className="mt-4">
                <Link href="/kanban">
                  <Button type="primary" size="large" block>
                    Accéder au Kanban
                  </Button>
                </Link>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Card
              hoverable
              className="text-center h-full"
              cover={
                <div className="p-8 bg-gradient-to-br from-green-50 to-green-100">
                  <UserOutlined className="text-6xl text-green-500" />
                </div>
              }
            >
              <Card.Meta
                title="Gestion des utilisateurs"
                description="Ajoutez et gérez les membres de votre équipe"
              />
              <div className="mt-4">
                <Link href="/users">
                  <Button type="default" size="large" block>
                    Gérer les utilisateurs
                  </Button>
                </Link>
              </div>
            </Card>
          </Col>
        </Row>
      </main>

      <footer className="mt-16 pt-8 border-t border-gray-200">
        <p className="text-center text-gray-500">© 2025 - Tous droits réservés</p>
      </footer>
    </>
  );
}
