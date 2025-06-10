package fr.caensup.kanban.entities

import jakarta.persistence.*
import java.util.*

@Entity
class Task(
    @Id
    @GeneratedValue
    var id: UUID = UUID.randomUUID(),

    var name: String,

    var description: String? = null,

    @ManyToMany
    @JoinTable(
        name = "task_members",
        joinColumns = [JoinColumn(name = "task_id")],
        inverseJoinColumns = [JoinColumn(name = "user_id")]
    )
    var assignedMembers: MutableList<User> = mutableListOf()
)
