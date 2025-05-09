import { Component, Host, State, h } from '@stencil/core';

@Component({
  tag: 'xpokorny-ambulance-wl-editor',
  styleUrl: 'xpokorny-ambulance-wl-editor.css',
  shadow: true,
})
export class XpokornyAmbulanceWlEditor {
  @State() doctors: any[] = [];
  @State() users: any[] = [
    { id: "10001", name: "Jožko Púčik" },
    { id: "10096", name: "Bc. August Cézar" },
    { id: "10028", name: "Ing. Ferdinand Trety" }
  ];
  @State() currentUserId = "10001";
  @State() selectedDoctor = "";
  @State() availableSlots: any[] = [];
  @State() selectedSlot: any = null;
  @State() selectedPatient = "self";
  @State() patientName = "";
  @State() condition = "";
  @State() selectedMonth: number = new Date().getMonth();
  @State() selectedYear: number = new Date().getFullYear();

  private async getDoctorsAsync() {
    return await Promise.resolve([
      { id: "doc1", name: "MUDr. Jana Nováková", specialization: "Všeobecný lekár" },
      { id: "doc2", name: "MUDr. Peter Horváth", specialization: "Kardiológ" },
      { id: "doc3", name: "MUDr. Mária Kováčová", specialization: "Neurológ" },
    ]);
  }

  private async getAvailableSlotsAsync(doctorId: string) {
    const slots = [];
    const lastDay = new Date(this.selectedYear, this.selectedMonth + 1, 0);
    const now = new Date();
    
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(this.selectedYear, this.selectedMonth, day);
      
      if (date.getDay() === 0 || date.getDay() === 6 || date < now) continue;
      
      for (let hour = 8; hour < 16; hour++) {
        for (const minute of [0, 30]) {
          date.setHours(hour, minute, 0, 0);
          
          if (date > now) {
            slots.push({
              id: `${doctorId}-${date.toISOString()}`,
              doctorId,
              startTime: new Date(date),
              durationMinutes: 30,
              available: Math.random() > 0.3,
            });
          }
        }
      }
    }

    return await Promise.resolve(slots);
  }

  async componentWillLoad() {
    this.doctors = await this.getDoctorsAsync();
  }

  private async handleDoctorSelect(doctorId: string) {
    this.selectedDoctor = doctorId;
    this.availableSlots = await this.getAvailableSlotsAsync(doctorId);
  }

  private handleSlotSelect(slot: any) {
    this.selectedSlot = slot;
  }

  private handlePatientTypeChange(event: Event) {
    this.selectedPatient = (event.target as HTMLSelectElement).value;
  }

  private handleMonthChange(increment: number) {
    let newMonth = this.selectedMonth + increment;
    let newYear = this.selectedYear;
    
    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }
    
    this.selectedMonth = newMonth;
    this.selectedYear = newYear;
    
    if (this.selectedDoctor) {
      this.handleDoctorSelect(this.selectedDoctor);
    }
  }

  private handleCreateReservation(event: Event) {
    event.preventDefault();

    if (!this.selectedDoctor || !this.selectedSlot) {
      alert("Prosím vyberte lekára a termín");
      return;
    }

    const doctor = this.doctors.find((d) => d.id === this.selectedDoctor);
    const user = this.users.find(u => u.id === this.currentUserId);

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
    };

    console.log("Created reservation:", newReservation);
    this.resetForm();
  }

  private resetForm() {
    this.selectedDoctor = "";
    this.selectedSlot = null;
    this.selectedPatient = "self";
    this.patientName = "";
    this.condition = "";
    this.availableSlots = [];
    
    this.selectedMonth = new Date().getMonth();
    this.selectedYear = new Date().getFullYear();
  }

  private getMonthName(month: number) {
    return new Date(2000, month, 1).toLocaleString('sk-SK', { month: 'long' });
  }

  private submitForm = (event: Event) => {
    event.preventDefault();
    this.handleCreateReservation(event);
  };

  private groupSlotsByDay(slots: any[]): { [day: string]: any[] } {
    const grouped: { [day: string]: any[] } = {};
  
    slots.filter(slot => slot.available).forEach(slot => {
      const day = slot.startTime.getDate();
      if (!grouped[day]) grouped[day] = [];
      grouped[day].push(slot);
    });
  
    return grouped;
  }

  render() {
    return (
      <Host>
        <div>
          <div class="header">
            <h2>Nová rezervácia</h2>
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

            <div class="form-group">
              <label>Pre koho:</label>
              <select onChange={(e) => this.handlePatientTypeChange(e)}>
                <option value="self">Pre seba</option>
                <option value="other">Pre iného pacienta</option>
              </select>
            </div>

            {this.selectedPatient === "other" && (
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
                Vytvoriť rezerváciu
              </button>
            </div>
          </form>
        </div>
      </Host>
    );
  }
}
