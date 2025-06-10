// src/main/kotlin/fr/caensup/kanban/services/DataInitializer.kt
package fr.caensup.kanban.services

import fr.caensup.kanban.entities.User
import fr.caensup.kanban.repositories.UserRepository
import org.springframework.boot.CommandLineRunner
import org.springframework.stereotype.Component

@Component
class DataInitializer(
    private val userRepository: UserRepository
    // SUPPRESSION: Plus de boardRepository, projectRepository, taskRepository pour l'instant
) : CommandLineRunner {

    override fun run(vararg args: String?) {
        // Vérifier si les données existent déjà
        if (userRepository.count() > 0) {
            println("Données déjà initialisées")
            return
        }

        println("🚀 Initialisation minimale des données...")

        try {
            // Création des utilisateurs SEULEMENT
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

            val savedUsers = userRepository.saveAll(listOf(user1, user2, user3))
            println("✅ ${savedUsers.size} utilisateurs créés")

            // PLUS DE CREATION DE BOARDS/TASKS pour l'instant

            println("🎉 Initialisation minimale terminée avec succès !")

        } catch (e: Exception) {
            println("❌ Erreur lors de l'initialisation: ${e.message}")
            e.printStackTrace()
        }
    }
}