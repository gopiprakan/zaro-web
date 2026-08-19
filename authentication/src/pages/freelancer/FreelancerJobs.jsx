import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function FreelancerJobs() {
  const { jobs } = useAuth();
  const [selectedTag, setSelectedTag] = useState('All');
  const [search, setSearch] = useState('');
  const [appliedJob, setAppliedJob] = useState(null);
  const [proposalRate, setProposalRate] = useState('4500');
  const [coverLetter, setCoverLetter] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState('');

  const allTags = ['All', 'Next.js', 'React', 'Three.js', 'Node.js', 'SEO', 'Tailwind'];

  const filteredJobs = jobs.filter(j => {
    const matchesTag = selectedTag === 'All' || j.tags.some(t => t.toLowerCase() === selectedTag.toLowerCase());
    const matchesSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
                          j.description.toLowerCase().includes(search.toLowerCase()) ||
                          j.client.toLowerCase().includes(search.toLowerCase());
    return matchesTag && matchesSearch;
  });

  const handleApplySubmit = (e) => {
    e.preventDefault();
    setSubmittedMessage(`Proposal submitted successfully to ${appliedJob.client}!`);
    setTimeout(() => {
      setAppliedJob(null);
      setSubmittedMessage('');
      setCoverLetter('');
    }, 2000);
  };

  return (
    <div className="dashboard-content-flow">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <h2>Available Client Projects & Gigs</h2>
          <p className="text-secondary">Explore verified retail shop website requests, digital catalogs, and full-stack builds.</p>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="table-controls-card">
        <div className="search-input-box">
          <i className="ri-search-line"></i>
          <input
            type="text"
            placeholder="Search by keywords, framework, or client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-button-group">
          {allTags.map((tag) => (
            <button
              key={tag}
              className={`filter-btn ${selectedTag === tag ? 'active' : ''}`}
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Job Cards */}
      <div className="job-listings-stack">
        {filteredJobs.map((job) => (
          <div key={job.id} className="job-listing-card">
            <div className="job-top-bar">
              <div>
                <span className="job-id-tag">{job.id} • {job.posted}</span>
                <h3 className="job-card-title">{job.title}</h3>
                <div className="job-client-row">
                  <i className="ri-building-line"></i>
                  <span>Client: <strong>{job.client}</strong></span>
                  <span className="client-verified-badge"><i className="ri-verified-badge-fill"></i> Payment Verified</span>
                </div>
              </div>
              <div className="job-budget-box">
                <span className="budget-amount">{job.budget}</span>
                <span className="budget-type">{job.type}</span>
              </div>
            </div>

            <p className="job-description-text">{job.description}</p>

            <div className="job-card-footer">
              <div className="job-tags-row">
                {job.tags.map((t, idx) => (
                  <span key={idx} className="tag-badge">{t}</span>
                ))}
              </div>
              <div className="job-actions-row">
                <span className="proposals-count">
                  <i className="ri-user-follow-line"></i> {job.proposals} Proposals
                </span>
                <button
                  className="action-btn-primary success-btn"
                  onClick={() => {
                    setAppliedJob(job);
                    setProposalRate(job.budget.replace(/[^0-9]/g, '') || '4000');
                  }}
                >
                  <i className="ri-send-plane-line"></i> Apply Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Apply Proposal Modal */}
      {appliedJob && (
        <div className="modal-backdrop" onClick={() => setAppliedJob(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Submit Proposal: {appliedJob.title}</h3>
              <button className="modal-close" onClick={() => setAppliedJob(null)}>
                <i className="ri-close-line"></i>
              </button>
            </div>

            {submittedMessage ? (
              <div className="auth-alert success" style={{ margin: '20px' }}>
                <i className="ri-checkbox-circle-line"></i>
                <span>{submittedMessage}</span>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="modal-form">
                <div className="form-group">
                  <label>Your Proposed Milestone Bid ($)</label>
                  <input
                    type="number"
                    value={proposalRate}
                    onChange={(e) => setProposalRate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Cover Letter / Relevant Experience</label>
                  <textarea
                    rows="5"
                    placeholder="Describe your technical approach, timeline estimate, and previous shop web design experience..."
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    required
                  ></textarea>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setAppliedJob(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="action-btn-primary success-btn">
                    <i className="ri-check-line"></i> Send Formal Proposal
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
