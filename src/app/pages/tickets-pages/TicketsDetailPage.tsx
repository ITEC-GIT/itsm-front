import React from 'react'
import { useNavigate,useLocation } from 'react-router-dom'

const TicketsDetailPage: React.FC = () => {
  const location = useLocation()
  const { ticket } = location.state || {}
  const navigate = useNavigate()
  if (!ticket) {
    return <div>No ticket data available</div>
  }

  return (
    <div className="card card-custom">
     <div className="card-header">
        <h3 className="card-title">{ticket.name}</h3>
        <button className="btn btn-sm btn-light" onClick={() => navigate('/tickets', { state: { from: 'details' } })}>
          Back
        </button>
      </div>
      <div className="card-body">
        <p><strong>ID:</strong> {ticket.id}</p>
        <p><strong>Date:</strong> {ticket.date}</p>
        <p><strong>Solve Date:</strong> {ticket.solvedate}</p>
        <p><strong>Status:</strong> {ticket.status}</p>
        <p><strong>Content:</strong> <span dangerouslySetInnerHTML={{ __html: ticket.content }} /></p>
        <p><strong>Priority:</strong> {ticket.priority}</p>
        <p><strong>Urgency:</strong> {ticket.urgency}</p>
        <p><strong>Impact:</strong> {ticket.impact}</p>
        <p><strong>Last Modified:</strong> {ticket.date_mod}</p>
      </div>
      <div className="card-footer">
        Footer
      </div>
    </div>
  )
}
export default TicketsDetailPage