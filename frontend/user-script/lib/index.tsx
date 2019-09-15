// 1. Script that creates a cript tag to a CDN version of a script
// 2. CDN version will create an iframe (zoid)
// 3. Booking app will live there (preact)

import zoid from 'zoid'

interface BookingWindow extends Window {
  BookaQuestID: string // Org id for now
  CrossSiteBookingComponent: any
}

const w = (window as any) as BookingWindow

const CrossSiteBookingComponent = zoid.create({
  tag: 'booking-component',
  url: `http://localhost:1234/booking/${w.BookaQuestID}`
})

w.CrossSiteBookingComponent = CrossSiteBookingComponent
