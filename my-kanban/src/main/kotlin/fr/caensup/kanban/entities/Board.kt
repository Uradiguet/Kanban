package fr.caensup.kanban.entities

import com.fasterxml.jackson.databind.ser.Serializers.Base
import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.ManyToMany
import jakarta.persistence.ManyToOne
import java.util.Date
import java.util.UUID

@Entity
open class Board:BaseWithName()