import { ref } from 'vue'
import { supabase } from '../config/supabase.js'

export function useEmailService() {
  const isLoading = ref(false)
  const error = ref(null)
  const success = ref(false)

  // Send contact form email
  const sendContactEmail = async (contactData) => {
    isLoading.value = true
    error.value = null
    success.value = false

    try {
      // Insert contact form data into Supabase
      const { data, error: insertError } = await supabase
        .from('contact_messages')
        .insert([
          {
            name: contactData.name,
            email: contactData.email,
            phone: contactData.phone || null,
            subject: contactData.subject,
            message: contactData.message,
            created_at: new Date().toISOString(),
            status: 'new'
          }
        ])

      if (insertError) {
        throw insertError
      }

      // Send email notification using Supabase Edge Functions
      const { data: emailData, error: emailError } = await supabase.functions.invoke('send-contact-email', {
        body: {
          to: 'info@dsk-ug-leipzig.de',
          subject: `Neue Kontaktanfrage: ${contactData.subject}`,
          html: `
            <h2>Neue Kontaktanfrage</h2>
            <p><strong>Name:</strong> ${contactData.name}</p>
            <p><strong>E-Mail:</strong> ${contactData.email}</p>
            ${contactData.phone ? `<p><strong>Telefon:</strong> ${contactData.phone}</p>` : ''}
            <p><strong>Betreff:</strong> ${contactData.subject}</p>
            <p><strong>Nachricht:</strong></p>
            <p>${contactData.message.replace(/\n/g, '<br>')}</p>
            <hr>
            <p><small>Diese E-Mail wurde über das Kontaktformular der DSK-UG Website gesendet.</small></p>
          `
        }
      })

      if (emailError) {
        console.warn('Email sending failed, but contact saved:', emailError)
        // Don't throw error here - contact is saved even if email fails
      }

      success.value = true
      return { success: true, data }

    } catch (err) {
      error.value = err.message || 'Fehler beim Senden der Nachricht'
      console.error('Contact email error:', err)
      return { success: false, error: err.message }
    } finally {
      isLoading.value = false
    }
  }

  // Send booking request email
  const sendBookingEmail = async (bookingData) => {
    isLoading.value = true
    error.value = null
    success.value = false

    try {
      // Insert booking request into Supabase
      const { data, error: insertError } = await supabase
        .from('booking_requests')
        .insert([
          {
            accommodation_id: bookingData.accommodationId,
            accommodation_name: bookingData.accommodationName,
            guest_name: bookingData.guestName,
            guest_email: bookingData.guestEmail,
            guest_phone: bookingData.guestPhone || null,
            check_in: bookingData.checkIn,
            check_out: bookingData.checkOut,
            guests: bookingData.guests,
            total_price: bookingData.totalPrice,
            special_requests: bookingData.specialRequests || null,
            created_at: new Date().toISOString(),
            status: 'pending'
          }
        ])

      if (insertError) {
        throw insertError
      }

      // Calculate nights
      const checkInDate = new Date(bookingData.checkIn)
      const checkOutDate = new Date(bookingData.checkOut)
      const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))

      // Send booking confirmation email
      const { data: emailData, error: emailError } = await supabase.functions.invoke('send-booking-email', {
        body: {
          to: 'buchungen@dsk-ug-leipzig.de',
          cc: bookingData.guestEmail,
          subject: `Neue Buchungsanfrage: ${bookingData.accommodationName}`,
          html: `
            <h2>Neue Buchungsanfrage</h2>
            <h3>Unterkunft</h3>
            <p><strong>Name:</strong> ${bookingData.accommodationName}</p>
            <p><strong>ID:</strong> ${bookingData.accommodationId}</p>
            
            <h3>Gast</h3>
            <p><strong>Name:</strong> ${bookingData.guestName}</p>
            <p><strong>E-Mail:</strong> ${bookingData.guestEmail}</p>
            ${bookingData.guestPhone ? `<p><strong>Telefon:</strong> ${bookingData.guestPhone}</p>` : ''}
            
            <h3>Buchungsdetails</h3>
            <p><strong>Check-in:</strong> ${new Date(bookingData.checkIn).toLocaleDateString('de-DE')}</p>
            <p><strong>Check-out:</strong> ${new Date(bookingData.checkOut).toLocaleDateString('de-DE')}</p>
            <p><strong>Nächte:</strong> ${nights}</p>
            <p><strong>Gäste:</strong> ${bookingData.guests}</p>
            <p><strong>Gesamtpreis:</strong> €${bookingData.totalPrice}</p>
            
            ${bookingData.specialRequests ? `
            <h3>Besondere Wünsche</h3>
            <p>${bookingData.specialRequests.replace(/\n/g, '<br>')}</p>
            ` : ''}
            
            <hr>
            <p><small>Diese Buchungsanfrage wurde über die DSK-UG Website eingereicht.</small></p>
          `
        }
      })

      if (emailError) {
        console.warn('Email sending failed, but booking saved:', emailError)
        // Don't throw error here - booking is saved even if email fails
      }

      success.value = true
      return { success: true, data }

    } catch (err) {
      error.value = err.message || 'Fehler beim Senden der Buchungsanfrage'
      console.error('Booking email error:', err)
      return { success: false, error: err.message }
    } finally {
      isLoading.value = false
    }
  }

  // Reset state
  const resetState = () => {
    isLoading.value = false
    error.value = null
    success.value = false
  }

  return {
    isLoading,
    error,
    success,
    sendContactEmail,
    sendBookingEmail,
    resetState
  }
}