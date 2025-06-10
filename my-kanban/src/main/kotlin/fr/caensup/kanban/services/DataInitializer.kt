package fr.caensup.kanban.services

import fr.caensup.kanban.entities.Board
import fr.caensup.kanban.entities.Project
import fr.caensup.kanban.entities.Task
import fr.caensup.kanban.entities.Priority
import fr.caensup.kanban.entities.User
import fr.caensup.kanban.repositories.BoardRepository
import fr.caensup.kanban.repositories.ProjectRepository
import fr.caensup.kanban.repositories.TaskRepository
import fr.caensup.kanban.repositories.UserRepository
import org.springframework.boot.CommandLineRunner
import org.springframework.stereotype.Component

@Component // AJOUT: Annotation manquante
class DataInitializer(
    private val userRepository: UserRepository,
    private val projectRepository: ProjectRepository,
    private val boardRepository: BoardRepository,
    private val taskRepository: TaskRepository // AJOUT: Repository manquant
) : CommandLineRunner {
    
    override fun run(vararg args: String?) {
        // Vérifier si les données existent déjà
        if (userRepository.count() > 0) {
            return // Données déjà initialisées
        }

        // Création des utilisateurs
        val user1 = User(
            username = "alice",
            password = "password1",
            email = "alice@example.com",
            firstname = "Alice",
            lastname = "Dupont"
        )
        val user2 = User(
            username = "bob",
            password = "password2",
            email = "bob@example.com",
            firstname = "Bob",
            lastname = "Martin"
        )
        val user3 = User(
            username = "charlie",
            password = "password3",
            email = "charlie@example.com",
            firstname = "Charlie",
            lastname = "Durand"
        )
        userRepository.saveAll(listOf(user1, user2, user3))

        // Création d'un projet
        val project = Project(
            name = "Projet Kanban",
            description = "Un projet de gestion de tâches",
            creator = user1
        )
        project.members.addAll(listOf(user1, user2, user3))
        val savedProject = projectRepository.save(project)

        // Création des boards avec des couleurs différentes
        val todoBoard = Board(
            name = "À faire",
            description = "Tâches à réaliser",
            color = "bg-red-100 border-red-300",
            position = 0,
            project = savedProject
        )
        val inProgressBoard = Board(
            name = "En cours",
            description = "Tâches en cours de réalisation",
            color = "bg-yellow-100 border-yellow-300",
            position = 1,
            project = savedProject
        )
        val reviewBoard = Board(
            name = "À réviser",
            description = "Tâches en attente de révision",
            color = "bg-blue-100 border-blue-300",
            position = 2,
            project = savedProject
        )
        val doneBoard = Board(
            name = "Terminé",
            description = "Tâches terminées",
            color = "bg-green-100 border-green-300",
            position = 3,
            project = savedProject
        )
        
        val savedBoards = boardRepository.saveAll(listOf(todoBoard, inProgressBoard, reviewBoard, doneBoard))

        // Création de tâches d'exemple
        val task1 = Task(
            title = "Concevoir l'interface utilisateur",
            description = "Créer les maquettes pour la nouvelle fonctionnalité",
            priority = Priority.HIGH,
            board = savedBoards[0]
        )
        task1.assignedUsers.add(user1)

        val task2 = Task(
            title = "Développer l'API backend",
            description = "Implémenter les endpoints REST",
            priority = Priority.HIGH,
            board = savedBoards[1]
        )
        task2.assignedUsers.add(user2)

        val task3 = Task(
            title = "Tests unitaires",
            description = "Écrire et exécuter les tests",
            priority = Priority.MEDIUM,
            board = savedBoards[2]
        )
        task3.assignedUsers.add(user3)

        taskRepository.saveAll(listOf(task1, task2, task3))

        println("Données initialisées avec succès !")
    }
}
