import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AdminPayments() {
  const { payments } = useAuth();

  const totalGMV = payments.reduce((acc, curr) => acc + curr.amount, 0) + 124500;
  const platformFees = Math.round(totalGMV * 0.12);
  const escrowLocked = 18400;

  return (
    <div className="dashboard-content-flow">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <h2>Platform Escrow & Payout Control</h2>
          <p className="text-secondary">Audit global payment rails, automated commission splits, and bank transfers.</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon-wrap warning">
            <i className="ri-safe-2-line"></i>
          </div>
          <div className="metric-data">
            <span className="metric-title">Locked in Escrow Vault</span>
            <span className="metric-val">${escrowLocked.toLocaleString()}</span>
            <span className="metric-sub positive">100% collateralized in Stripe</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap success">
            <i className="ri-money-dollar-circle-line"></i>
          </div>
          <div className="metric-data">
            <span className="metric-title">Platform Net Commission</span>
            <span className="metric-val text-success">${platformFees.toLocaleString()}</span>
            <span className="metric-sub positive">Auto-deposited daily</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap primary">
            <i className="ri-bank-card-line"></i>
          </div>
          <div className="metric-data">
            <span className="metric-title">Total Processed Volume</span>
            <span className="metric-val">${totalGMV.toLocaleString()}</span>
            <span className="metric-sub">Across all connected shops</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="portal-glass-panel">
        <div className="panel-header">
          <h3>Global Escrow Transaction Ledger</h3>
          <span className="panel-count">{payments.length} Transactions</span>
        </div>

        <div className="responsive-table-container">
          <table className="portal-data-table">
            <thead>
              <tr>
                <th>Transaction #</th>
                <th>Project Scope</th>
                <th>Client Source</th>
                <th>Total Settled</th>
                <th>Platform Fee (12%)</th>
                <th>Net to Dev</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => {
                const pFee = Math.round(p.amount * 0.12);
                const netDev = p.amount - pFee;
                return (
                  <tr key={p.id}>
                    <td><span className="code-text">{p.id}</span></td>
                    <td>
                      <div className="table-item-title">{p.project}</div>
                      <div className="table-item-sub">{p.milestone}</div>
                    </td>
                    <td>Stripe / ACH</td>
                    <td><strong>${p.amount.toLocaleString()}</strong></td>
                    <td><span className="text-success">+${pFee.toLocaleString()}</span></td>
                    <td>${netDev.toLocaleString()}</td>
                    <td><span className="status-badge completed">Disbursed</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
