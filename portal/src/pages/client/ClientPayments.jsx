import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function ClientPayments() {
  const { payments, addPayment } = useAuth();
  const [showAddMethodModal, setShowAddMethodModal] = useState(false);

  const totalPaid = payments.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="dashboard-content-flow">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <h2>Client Invoices & Escrow Settlements</h2>
          <p className="text-secondary">Track milestone payments, platform receipts, and manage payment methods.</p>
        </div>
        <button className="action-btn-primary" onClick={() => setShowAddMethodModal(true)}>
          <i className="ri-add-line"></i> Add Payment Method
        </button>
      </div>

      {/* Financial Overview Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon-wrap success">
            <i className="ri-money-dollar-circle-line"></i>
          </div>
          <div className="metric-data">
            <span className="metric-title">Total Settled Escrow</span>
            <span className="metric-val">${totalPaid.toLocaleString()}</span>
            <span className="metric-sub positive">5 invoices cleared</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap warning">
            <i className="ri-time-line"></i>
          </div>
          <div className="metric-data">
            <span className="metric-title">In Escrow Vault</span>
            <span className="metric-val">$4,000</span>
            <span className="metric-sub">Auto-releases upon deliverable approval</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap primary">
            <i className="ri-bank-card-2-line"></i>
          </div>
          <div className="metric-data">
            <span className="metric-title">Active Payment Method</span>
            <span className="metric-val">Stripe Vault</span>
            <span className="metric-sub">Default (Corporate Visa ****8901)</span>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="portal-glass-panel">
        <div className="panel-header">
          <h3>Transaction History & Invoices</h3>
          <span className="panel-count">{payments.length} Transactions</span>
        </div>

        <div className="responsive-table-container">
          <table className="portal-data-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Project / Milestone</th>
                <th>Payment Date</th>
                <th>Method</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id}>
                  <td><strong className="code-text">{p.id}</strong></td>
                  <td>
                    <div className="table-item-title">{p.project}</div>
                    <div className="table-item-sub">{p.milestone}</div>
                  </td>
                  <td>{p.date}</td>
                  <td>
                    <span className="table-method-tag">
                      <i className="ri-shield-check-line"></i> {p.method}
                    </span>
                  </td>
                  <td><strong className="table-price-val">${p.amount.toLocaleString()}</strong></td>
                  <td><span className="status-badge completed">Paid & Cleared</span></td>
                  <td>
                    <button
                      className="receipt-download-btn"
                      onClick={() => alert(`Downloading official PDF receipt for ${p.id}...`)}
                      title="Download PDF Invoice"
                    >
                      <i className="ri-file-pdf-line"></i> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Method Modal */}
      {showAddMethodModal && (
        <div className="modal-backdrop" onClick={() => setShowAddMethodModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Payment Card / Bank ACH</h3>
              <button className="modal-close" onClick={() => setShowAddMethodModal(false)}>
                <i className="ri-close-line"></i>
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setShowAddMethodModal(false); }} className="modal-form">
              <div className="form-group">
                <label>Cardholder Full Name</label>
                <input type="text" placeholder="Elena Rostova" required />
              </div>
              <div className="form-group">
                <label>Card Number</label>
                <input type="text" placeholder="4242 •••• •••• 4242" required />
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label>Expiry (MM/YY)</label>
                  <input type="text" placeholder="08/29" required />
                </div>
                <div className="form-group">
                  <label>CVC / CVV</label>
                  <input type="text" placeholder="890" required />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowAddMethodModal(false)}>Cancel</button>
                <button type="submit" className="action-btn-primary">Save Payment Method</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
