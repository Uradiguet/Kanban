package fr.caensup.kanban.entities

import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.*

@Entity
@Table(name = "task")
class Task {
    @Id
    var id: UUID = UUID.randomUUID()

    @Column(nullable = false)
    var title: String = ""

    @Column(length = 1000)
    var description: String? = null

    @Column(nullable = false)
    var priority: String = "medium"

    var dueDate: String? = null

    @Column(name = "board_id")
    var boardId: UUID? = null

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "task_assigned_users",
        joinColumns = [JoinColumn(name = "task_id")],
        inverseJoinColumns = [JoinColumn(name = "user_id")]
    )
    var assignedUsers: MutableList<User> = mutableListOf()

    var createdAt: LocalDateTime = LocalDateTime.now()
    var updatedAt: LocalDateTime = LocalDateTime.now()

    constructor()

    constructor(
        title: String,
        description: String? = null,
        priority: String = "medium",
        boardId: UUID? = null
    ) {
        this.title = title
        this.description = description
        this.priority = priority
        this.boardId = boardId
    }
}