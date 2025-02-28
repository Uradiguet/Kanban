package fr.caensup.kanban.entities

import jakarta.persistence.Entity
import java.util.UUID

@Entity
open class Board(

    id:UUID = UUID.randomUUID(),
    name:String? = null,
    description:String? = null,

):baseWithName(

    id = id,
    name = name,
    description = description

) {
}