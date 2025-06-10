package fr.caensup.kanban.entities

import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.*

@Entity
@Table(name = "board")
class Board {
    @Id
    var id: UUID = UUID.randomUUID()

    @Column(nullable = false)
    var name: String = ""

    @Column(length = 500)
    var description: String? = null

    @Column(nullable = false)
    var color: String = "bg-gray-100 border-gray-300"

    @Column(nullable = false)
    var position: Int = 0

    var createdAt: LocalDateTime = LocalDateTime.now()
    var updatedAt: LocalDateTime = LocalDateTime.now()

    // Constructeurs
    constructor()

    constructor(
        name: String = "",
        description: String? = null,
        color: String = "bg-gray-100 border-gray-300",
        position: Int = 0
    ) {
        this.name = name
        this.description = description
        this.color = color
        this.position = position
    }
}