import { ref } from 'vue'
import api from '../services/api.js'

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
      // Trigger mail via backend (Microsoft Graph) which also saves to DB
      await api.post('/mail/send-booking', bookingData)

      success.value = true
      return { success: true }

    } catch (err) {
      error.value = err.msg || err.message || 'Fehler beim Senden der Buchungsanfrage'
      console.error('Booking email error:', err)
      return { success: false, error: error.value }
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