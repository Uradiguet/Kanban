package fr.caensup.kanban.entities

import jakarta.persistence.*
import java.time.LocalDate
import java.time.LocalDateTime
import java.util.*

@Entity
class Task(
    @Id
    var id: UUID = UUID.randomUUID(),

    // CHANGEMENT: "name" -> "title" pour correspondre au frontend
    @Column(nullable = false)
    var title: String,

    @Column(length = 1000)
    var description: String? = null,

    // AJOUT: Champ priority manquant
    @Enumerated(EnumType.STRING)
    var priority: Priority = Priority.MEDIUM,

    // AJOUT: Date d'échéance
    var dueDate: LocalDate? = null,

    // AJOUT: Relation avec Board
    @ManyToOne
    @JoinColumn(name = "board_id")
    @com.fasterxml.jackson.annotation.JsonBackReference
    var board: Board? = null,

    // CHANGEMENT: assignedMembers -> assignedUsers + correction de la relation
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "task_assigned_users",
        joinColumns = [JoinColumn(name = "task_id")],
        inverseJoinColumns = [JoinColumn(name = "user_id")]
    )
    var assignedUsers: MutableList<User> = mutableListOf(),

    // AJOUT: Timestamps
    var createdAt: LocalDateTime = LocalDateTime.now(),
    var updatedAt: LocalDateTime = LocalDateTime.now()
)

// AJOUT: Enum pour les priorités
enum class Priority {
    LOW, MEDIUM, HIGH
}
