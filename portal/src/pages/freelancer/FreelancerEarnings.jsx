import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function FreelancerEarnings() {
  const { payments } = useAuth();
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('4000');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const availableBalance = 8940;
  const lifetimeEarned = 68500;
  const pendingInEscrow = 3800;

  const handleWithdraw = (e) => {
    e.preventDefault();
    setWithdrawSuccess(true);
    setTimeout(() => {
      setWithdrawSuccess(false);
      setShowWithdrawModal(false);
    }, 2000);
  };

  return (
    <div className="dashboard-content-flow">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <h2>Freelancer Financials & Payouts</h2>
          <p className="text-secondary">Track milestone earnings, withdraw funds to your bank, and inspect historical fee statements.</p>
        </div>
        <button
          className="action-btn-primary success-btn"
          onClick={() => setShowWithdrawModal(true)}
        >
          <i className="ri-hand-coin-line"></i> Withdraw Funds
        </button>
      </div>

      {/* Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon-wrap success">
            <i className="ri-wallet-3-line"></i>
          </div>
          <div className="metric-data">
            <span className="metric-title">Available for Withdrawal</span>
            <span className="metric-val text-success">${availableBalance.toLocaleString()}</span>
            <span className="metric-sub positive">Zero withdrawal fee on ACH</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap warning">
            <i className="ri-lock-2-line"></i>
          </div>
          <div className="metric-data">
            <span className="metric-title">Pending in Milestone Escrow</span>
            <span className="metric-val">${pendingInEscrow.toLocaleString()}</span>
            <span className="metric-sub">Releases on client milestone approval</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap primary">
            <i className="ri-line-chart-line"></i>
          </div>
          <div className="metric-data">
            <span className="metric-title">Lifetime Platform Earnings</span>
            <span className="metric-val">${lifetimeEarned.toLocaleString()}</span>
            <span className="metric-sub positive">Across 18 completed projects</span>
          </div>
        </div>
      </div>

      {/* Earnings Table */}
      <div className="portal-glass-panel">
        <div className="panel-header">
          <h3>Payout & Milestone Ledger</h3>
        </div>

        <div className="responsive-table-container">
          <table className="portal-data-table">
            <thead>
              <tr>
                <th>Reference #</th>
                <th>Client / Project</th>
                <th>Milestone Description</th>
                <th>Date Settled</th>
                <th>Gross Amount</th>
                <th>Net Payout</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id}>
                  <td><strong className="code-text">{p.id}</strong></td>
                  <td><strong>{p.project}</strong></td>
                  <td>{p.milestone}</td>
                  <td>{p.date}</td>
                  <td>${p.amount.toLocaleString()}</td>
                  <td><strong className="text-success">${(p.amount - (p.fee || 50)).toLocaleString()}</strong></td>
                  <td><span className="status-badge completed">Deposited</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="modal-backdrop" onClick={() => setShowWithdrawModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Transfer Earnings to Bank Account</h3>
              <button className="modal-close" onClick={() => setShowWithdrawModal(false)}>
                <i className="ri-close-line"></i>
              </button>
            </div>

            {withdrawSuccess ? (
              <div className="auth-alert success" style={{ margin: '20px' }}>
                <i className="ri-checkbox-circle-line"></i>
                <span>Transfer of ${withdrawAmount} initiated! Estimated arrival: 1-2 business days.</span>
              </div>
            ) : (
              <form onSubmit={handleWithdraw} className="modal-form">
                <div className="form-group">
                  <label>Withdrawal Amount ($)</label>
                  <input
                    type="number"
                    max={availableBalance}
                    min="100"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    required
                  />
                  <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                    Available: ${availableBalance.toLocaleString()}
                  </small>
                </div>

                <div className="form-group">
                  <label>Destination Account</label>
                  <select defaultValue="chase">
                    <option value="chase">Chase Business Checking (•••• 9012)</option>
                    <option value="stripe">Stripe Instant Payout Debit Card (•••• 4410)</option>
                    <option value="paypal">PayPal Direct Transfer (marcus@zaro.dev)</option>
                  </select>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowWithdrawModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="action-btn-primary success-btn">
                    <i className="ri-check-double-line"></i> Confirm Payout
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
