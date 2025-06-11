package fr.caensup.kanban.entities

import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.*

@Entity
class Board(
    id: UUID = UUID.randomUUID(),
    name: String? = null,
    description: String? = null,

    // AJOUT: Champ color pour l'UI
    @Column(nullable = false)
    var color: String = "bg-gray-100 border-gray-300",

    // AJOUT: Position pour l'ordre des colonnes
    @Column(nullable = false)
    var position: Int = 0,

    // AJOUT: Relation avec Project
    @ManyToOne
    @JoinColumn(name = "project_id")
    var project: Project? = null,

    // AJOUT: Relation avec les tâches
    @OneToMany(mappedBy = "board", cascade = [CascadeType.ALL], orphanRemoval = true)
    @com.fasterxml.jackson.annotation.JsonManagedReference
    var tasks: MutableList<Task> = mutableListOf(),

    // AJOUT: Timestamps
    var createdAt: LocalDateTime = LocalDateTime.now(),
    var updatedAt: LocalDateTime = LocalDateTime.now()

) : BaseWithName(
    id = id,
    name = name,
    description = description
)
