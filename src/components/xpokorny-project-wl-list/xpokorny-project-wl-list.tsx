import { Component, State, Event, EventEmitter,  Host, h } from '@stencil/core';

@Component({
  tag: "xpokorny-project-wl-list",
  styleUrl: "xpokorny-project-wl-list.css",
  shadow: true,
})
export class XpokornyProjectWlList {
  @Event({ eventName: "entry-clicked"}) entryClicked: EventEmitter<string>;
  @State() doctors: any[] = []
  @State() myReservations: any[] = []
  @State() currentUserId = "10001"
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

  private handleUserChange(event: Event) {
    this.currentUserId = (event.target as HTMLSelectElement).value
  }

  private handleDeleteReservation(reservationId: string) {
    if (confirm("Naozaj chcete zrušiť túto rezerváciu?")) {
      this.myReservations = this.myReservations.filter((res) => res.id !== reservationId)
    }
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

  private getCreatedByText(createdBy: string) {
    if (createdBy === 'self') {
      return 'Vytvorené pacientom'
    } else {
      const doctor = this.doctors.find(d => d.id === createdBy)
      return doctor ? `Vytvorené lekárom: ${doctor.name}` : 'Vytvorené systémom'
    }
  }

  render() {
    const filteredReservations = this.myReservations.filter(
      res => res.patientId === this.currentUserId
    )
    
    const currentUser = this.users.find(user => user.id === this.currentUserId)

    return (
      <Host>
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
          </div>

          {filteredReservations.length === 0 ? (
            <p>Nemáte žiadne rezervácie</p>
          ) : (
            <md-list class="md-list-reservation">
              {filteredReservations.map((reservation, index) => (
                <md-list-item 
                  key={reservation.id} 
                  class="md-list-item-reservation"
                  onClick={() => this.entryClicked.emit(index.toString())}
                >
                  <div slot="headline">{reservation.doctorName}</div>
                  <div slot="supporting-text">{"Termín: " + this.formatDateTime(reservation.startTime)}</div>
                  <div slot="supporting-text">{"Dôvod: " + reservation.condition}</div>
                  <div slot="supporting-text" class="created-by">{this.getCreatedByText(reservation.createdBy)}</div>
                  <div slot="end">
                    <button 
                      class="primary-button small"
                      onClick={(e) => {
                        e.stopPropagation();
                        this.entryClicked.emit(index.toString());
                      }}
                    >
                      Upraviť
                    </button>
                    <button 
                      class="danger-button small"
                      onClick={(e) => {
                        e.stopPropagation();
                        this.handleDeleteReservation(reservation.id);
                      }}
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
      </Host>
    )
  }
}
