"use client"

import { Component, Host, State, h } from "@stencil/core"

@Component({
  tag: "xpokorny-project-wl-list",
  styleUrl: "xpokorny-project-wl-list.css",
  shadow: true,
})
export class XpokornyProjectWlList {
  @State() doctors: any[] = []
  @State() availableSlots: any[] = []
  @State() myReservations: any[] = []
  @State() currentView: "create" | "myReservations" = "myReservations"
  @State() selectedDoctor = ""
  @State() selectedSlot: any = null
  @State() selectedPatient = "self"
  @State() patientName = ""
  @State() condition = ""
  @State() editingReservation: any = null
  @State() currentUserId = "10001" // Default logged user
  @State() selectedMonth: number = new Date().getMonth()
  @State() selectedYear: number = new Date().getFullYear()
  @State() users: any[] = [
    { id: "10001", name: "Jožko Púčik" },
    { id: "10096", name: "Bc. August Cézar" },
    { id: "10028", name: "Ing. Ferdinand Trety" }
  ]

  private async getDoctorsAsync() {
    return await Promise.resolve([
      { id: "doc1", name: "MUDr. Jana Nováková", specialization: "Všeobecný lekár" },
      { id: "doc2", name: "MUDr. Peter Horváth", specialization: "Kardiológ" },
      { id: "doc3", name: "MUDr. Mária Kováčová", specialization: "Neurológ" },
    ])
  }

  private async getAvailableSlotsAsync(doctorId: string) {
    // Generate time slots for the selected month
    const slots = []
    const lastDay = new Date(this.selectedYear, this.selectedMonth + 1, 0)
    const now = new Date()
    
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(this.selectedYear, this.selectedMonth, day)
      
      // Skip weekends and past days
      if (date.getDay() === 0 || date.getDay() === 6 || date < now) continue
      
      // Generate slots from 8:00 to 16:00 with 30 min intervals
      for (let hour = 8; hour < 16; hour++) {
        for (const minute of [0, 30]) {
          date.setHours(hour, minute, 0, 0)
          
          // Only include future times
          if (date > now) {
            slots.push({
              id: `${doctorId}-${date.toISOString()}`,
              doctorId,
              startTime: new Date(date),
              durationMinutes: 30,
              available: Math.random() > 0.3, // Randomly mark some as unavailable
            })
          }
        }
      }
    }

    return await Promise.resolve(slots)
  }

  private async getMyReservationsAsync() {
    return await Promise.resolve([
      {
        id: "res1",
        patientId: "10001",
        patientName: "Jožko Púčik",
        doctorId: "doc1",
        doctorName: "MUDr. Jana Nováková",
        startTime: new Date(Date.now() + 2 * 24 * 60 * 60000),
        durationMinutes: 30,
        condition: "Preventívna prehliadka",
        createdBy: "self"
      },
      {
        id: "res2",
        patientId: "10001",
        patientName: "Jožko Púčik",
        doctorId: "doc2",
        doctorName: "MUDr. Peter Horváth",
        startTime: new Date(Date.now() + 5 * 24 * 60 * 60000),
        durationMinutes: 45,
        condition: "EKG vyšetrenie",
        createdBy: "doc1"
      },
      {
        id: "res3",
        patientId: "10096",
        patientName: "Bc. August Cézar",
        doctorId: "doc3",
        doctorName: "MUDr. Mária Kováčová",
        startTime: new Date(Date.now() + 3 * 24 * 60 * 60000),
        durationMinutes: 30,
        condition: "Bolesti hlavy",
        createdBy: "self"
      },
      {
        id: "res4",
        patientId: "10028",
        patientName: "Ing. Ferdinand Trety",
        doctorId: "doc1",
        doctorName: "MUDr. Jana Nováková",
        startTime: new Date(Date.now() + 1 * 24 * 60 * 60000),
        durationMinutes: 30,
        condition: "Chrípka",
        createdBy: "doc2"
      }
    ])
  }

  async componentWillLoad() {
    this.doctors = await this.getDoctorsAsync()
    this.myReservations = await this.getMyReservationsAsync()
  }

  private async handleDoctorSelect(doctorId: string) {
    this.selectedDoctor = doctorId
    this.availableSlots = await this.getAvailableSlotsAsync(doctorId)
  }

  private handleSlotSelect(slot: any) {
    this.selectedSlot = slot
  }

  private handlePatientTypeChange(event: Event) {
    this.selectedPatient = (event.target as HTMLSelectElement).value
  }

  private handleUserChange(event: Event) {
    this.currentUserId = (event.target as HTMLSelectElement).value
  }

  private handleMonthChange(increment: number) {
    let newMonth = this.selectedMonth + increment
    let newYear = this.selectedYear
    
    if (newMonth > 11) {
      newMonth = 0
      newYear++
    } else if (newMonth < 0) {
      newMonth = 11
      newYear--
    }
    
    this.selectedMonth = newMonth
    this.selectedYear = newYear
    
    if (this.selectedDoctor) {
      this.handleDoctorSelect(this.selectedDoctor)
    }
  }

  private handleCreateReservation(event: Event) {
    event.preventDefault()
    console.log("Creating reservation...")

    if (!this.selectedDoctor || !this.selectedSlot) {
      alert("Prosím vyberte lekára a termín")
      return
    }

    const doctor = this.doctors.find((d) => d.id === this.selectedDoctor)
    const user = this.users.find(u => u.id === this.currentUserId)

    const newReservation = {
      id: `res${Date.now()}`,
      patientId: this.selectedPatient === "self" ? this.currentUserId : "other",
      patientName: this.selectedPatient === "self" ? user.name : this.patientName,
      doctorId: this.selectedDoctor,
      doctorName: doctor.name,
      startTime: this.selectedSlot.startTime,
      durationMinutes: 30,
      condition: this.condition,
      createdBy: "self"
    }

    this.myReservations = [...this.myReservations, newReservation]
    this.resetForm()
    this.currentView = "myReservations"
  }

  private handleUpdateReservation(event: Event) {
    event.preventDefault()
    console.log("Updating reservation...")

    if (!this.selectedDoctor || !this.selectedSlot) {
      alert("Prosím vyberte lekára a termín")
      return
    }

    const doctor = this.doctors.find((d) => d.id === this.selectedDoctor)

    const updatedReservation = {
      ...this.editingReservation,
      doctorId: this.selectedDoctor,
      doctorName: doctor.name,
      startTime: this.selectedSlot.startTime,
      condition: this.condition,
    }

    this.myReservations = this.myReservations.map((res) =>
      res.id === updatedReservation.id ? updatedReservation : res,
    )

    this.resetForm()
    this.currentView = "myReservations"
  }

  private handleDeleteReservation(reservationId: string) {
    if (confirm("Naozaj chcete zrušiť túto rezerváciu?")) {
      this.myReservations = this.myReservations.filter((res) => res.id !== reservationId)
    }
  }

  private handleEditReservation(reservation: any) {
    this.editingReservation = reservation
    this.selectedDoctor = reservation.doctorId
    this.condition = reservation.condition
    
    // Set month and year based on reservation date
    const date = new Date(reservation.startTime)
    this.selectedMonth = date.getMonth()
    this.selectedYear = date.getFullYear()
    
    this.handleDoctorSelect(reservation.doctorId)
    this.currentView = "create"
  }

  private resetForm() {
    this.selectedDoctor = ""
    this.selectedSlot = null
    this.selectedPatient = "self"
    this.patientName = ""
    this.condition = ""
    this.editingReservation = null
    this.availableSlots = []
    
    // Reset date to current month/year
    this.selectedMonth = new Date().getMonth()
    this.selectedYear = new Date().getFullYear()
  }

  private formatDateTime(date: Date) {
    return new Date(date).toLocaleString("sk-SK", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  private getMonthName(month: number) {
    return new Date(2000, month, 1).toLocaleString('sk-SK', { month: 'long' })
  }

  private getCreatedByText(createdBy: string) {
    if (createdBy === 'self') {
      return 'Vytvorené pacientom'
    } else {
      const doctor = this.doctors.find(d => d.id === createdBy)
      return doctor ? `Vytvorené lekárom: ${doctor.name}` : 'Vytvorené systémom'
    }
  }

  private submitForm = (event: Event) => {
    event.preventDefault()
    console.log("Form submitted")
    
    if (this.editingReservation) {
      this.handleUpdateReservation(event)
    } else {
      this.handleCreateReservation(event)
    }
  }

  // Helper function to group slots by day
  private groupSlotsByDay(slots: any[]): { [day: string]: any[] } {
    const grouped: { [day: string]: any[] } = {}
  
    slots.filter(slot => slot.available).forEach(slot => {
      const day = slot.startTime.getDate()
      if (!grouped[day]) grouped[day] = []
      grouped[day].push(slot)
    })
  
    return grouped
  }

  renderCreateForm() {
    const isEditing = !!this.editingReservation

    return (
      <div>
        <div class="header">
          <h2>{isEditing ? "Upraviť rezerváciu" : "Nová rezervácia"}</h2>
          <button
            class="primary-button"
            onClick={() => {
              this.resetForm()
              this.currentView = "myReservations"
            }}
          >
            Späť
          </button>
        </div>

        <form onSubmit={(e) => this.submitForm(e)}>
          <div class="form-group">
            <label>Lekár:</label>
            <select onChange={(e) => this.handleDoctorSelect((e.target as HTMLSelectElement).value)} required>
              <option value="" selected={!this.selectedDoctor}>
                Vyberte lekára
              </option>
              {this.doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id} selected={this.selectedDoctor === doctor.id}>
                  {doctor.name} - {doctor.specialization}
                </option>
              ))}
            </select>
          </div>

          {this.selectedDoctor && (
            <div class="form-group calendar-container">
              <label>Dostupné termíny:</label>
              
              <div class="calendar-header">
                <button type="button" class="icon-button" onClick={() => this.handleMonthChange(-1)}>
                  <span>←</span>
                </button>
                <div class="month-year">
                  {this.getMonthName(this.selectedMonth)} {this.selectedYear}
                </div>
                <button type="button" class="icon-button" onClick={() => this.handleMonthChange(1)}>
                  <span>→</span>
                </button>
              </div>
              
              <div class="calendar-days">
                {Object.entries(this.groupSlotsByDay(this.availableSlots)).map(([day, slots]) => (
                  <div key={day} class="calendar-day">
                    <div class="day-header">{day}. {this.getMonthName(this.selectedMonth)}</div>
                    <div class="day-slots">
                      {slots.map(slot => (
                        <div
                          key={slot.id}
                          class={{ "time-slot": true, selected: this.selectedSlot?.id === slot.id }}
                          onClick={() => this.handleSlotSelect(slot)}
                        >
                          {slot.startTime.toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isEditing && (
            <div class="form-group">
              <label>Pre koho:</label>
              <select onChange={(e) => this.handlePatientTypeChange(e)}>
                <option value="self">Pre seba</option>
                <option value="other">Pre iného pacienta</option>
              </select>
            </div>
          )}

          {this.selectedPatient === "other" && !isEditing && (
            <div class="form-group">
              <label>Meno pacienta:</label>
              <input
                type="text"
                value={this.patientName}
                onInput={(e) => (this.patientName = (e.target as HTMLInputElement).value)}
                required
              />
            </div>
          )}

          <div class="form-group">
            <label>Dôvod návštevy:</label>
            <textarea
              value={this.condition}
              onInput={(e) => (this.condition = (e.target as HTMLTextAreaElement).value)}
              required
            ></textarea>
          </div>

          <div class="form-actions">
            <button 
              type="submit" 
              class="primary-button"
              disabled={!this.selectedSlot}
            >
              {isEditing ? 'Aktualizovať rezerváciu' : 'Vytvoriť rezerváciu'}
            </button>
          </div>
        </form>
      </div>
    )
  }

  renderMyReservations() {
    // Filter reservations for the current user
    const filteredReservations = this.myReservations.filter(
      res => res.patientId === this.currentUserId
    )
    
    // Find current user
    const currentUser = this.users.find(user => user.id === this.currentUserId)

    return (
      <div>
        <div class="header">
          <div class="user-selector">
            <h2>Moje rezervácie</h2>
            <div class="user-switcher">
              <div class="user-info">
                <div class="user-avatar">{currentUser?.name.charAt(0)}</div>
                <div class="user-name">{currentUser?.name}</div>
              </div>
              <div class="user-dropdown-container">
                <select class="user-dropdown" onChange={(e) => this.handleUserChange(e)}>
                  {this.users.map((user) => (
                    <option key={user.id} value={user.id} selected={user.id === this.currentUserId}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div class="actions">
            <button 
              class="primary-button"
              onClick={() => (this.currentView = "create")}
            >
              Nová rezervácia
            </button>
          </div>
        </div>

        {filteredReservations.length === 0 ? (
          <p>Nemáte žiadne rezervácie</p>
        ) : (
          <md-list class="md-list-reservation">
            {filteredReservations.map((reservation) => (
              <md-list-item key={reservation.id} class="md-list-item-reservation">
                <div slot="headline">{reservation.doctorName}</div>
                <div slot="supporting-text">{"Termín: " + this.formatDateTime(reservation.startTime)}</div>
                <div slot="supporting-text">{"Dôvod: " + reservation.condition}</div>
                <div slot="supporting-text" class="created-by">{this.getCreatedByText(reservation.createdBy)}</div>
                <div slot="end">
                  <button 
                    class="primary-button small"
                    onClick={() => this.handleEditReservation(reservation)}
                  >
                    Upraviť
                  </button>
                  <button 
                    class="danger-button small"
                    onClick={() => this.handleDeleteReservation(reservation.id)}
                  >
                    Zrušiť
                  </button>
                </div>
                <md-icon slot="start">event</md-icon>
              </md-list-item>
            ))}
          </md-list>
        )}
      </div>
    )
  }

  render() {
    return (
      <Host>
        {this.currentView === "create" && this.renderCreateForm()}
        {this.currentView === "myReservations" && this.renderMyReservations()}
      </Host>
    )
  }
}
