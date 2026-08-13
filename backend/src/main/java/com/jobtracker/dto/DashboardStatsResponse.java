package com.jobtracker.dto;

public class DashboardStatsResponse {

    private long totalApplications;
    private long applied;
    private long screening;
    private long interviews;
    private long offers;
    private long rejected;
    private long withdrawn;

    public long getTotalApplications() {
        return totalApplications;
    }

    public void setTotalApplications(long totalApplications) {
        this.totalApplications = totalApplications;
    }

    public long getApplied() {
        return applied;
    }

    public void setApplied(long applied) {
        this.applied = applied;
    }

    public long getScreening() {
        return screening;
    }

    public void setScreening(long screening) {
        this.screening = screening;
    }

    public long getInterviews() {
        return interviews;
    }

    public void setInterviews(long interviews) {
        this.interviews = interviews;
    }

    public long getOffers() {
        return offers;
    }

    public void setOffers(long offers) {
        this.offers = offers;
    }

    public long getRejected() {
        return rejected;
    }

    public void setRejected(long rejected) {
        this.rejected = rejected;
    }

    public long getWithdrawn() {
        return withdrawn;
    }

    public void setWithdrawn(long withdrawn) {
        this.withdrawn = withdrawn;
    }
}
