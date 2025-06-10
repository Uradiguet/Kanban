package fr.caensup.kanban.services

import fr.caensup.kanban.entities.Board
import fr.caensup.kanban.entities.Project
import fr.caensup.kanban.entities.User
import fr.caensup.kanban.repositories.BoardRepository
import fr.caensup.kanban.repositories.ProjectRepository
import fr.caensup.kanban.repositories.UserRepository
import org.springframework.boot.CommandLineRunner
import org.springframework.stereotype.Component
import java.util.*

class DataInitializer(
    private val userRepository: UserRepository,
    private val projectRepository: ProjectRepository,
    private val boardRepository: BoardRepository
) : CommandLineRunner {
    override fun run(vararg args: String?) {
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
        userRepository.saveAll(listOf(user1, user2))

        // Création d'un projet avec Alice comme créatrice
        val project = Project(
            name = "Projet Kanban",
            description = "Un projet de gestion de tâches",
            creator = user1
        )
        project.members.add(user1)
        project.members.add(user2)
        projectRepository.save(project)

        // Création d'un board lié au projet
        val board = Board().apply {
            name = "Tableau Principal"
            description = "Un board pour suivre les tâches"
        }
        boardRepository.save(board)

        println("Données initialisées avec succès !")
    }
}
