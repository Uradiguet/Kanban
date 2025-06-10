package fr.caensup.kanban.repositories

import fr.caensup.kanban.entities.User
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface UserRepository:JpaRepository<User,UUID> {

}
