---
name: financial-tracker
description: Personal and business finance tracking - expenses, invoices, cash flow, and financial insights
---

# Financial Tracker Skill

## Overview
Track personal and business finances, manage invoices, monitor cash flow, and get financial insights.

## When to Use
- User mentions money/expenses
- User asks about invoices
- User wants financial overview
- User mentions clients/payments
- User asks duit masuk/keluar

## Capabilities

### 1. Expense Tracking
- Log expenses by category
- Receipt parsing (if image provided)
- Monthly summaries
- Budget vs actual

### 2. Invoice Management
- Track pending invoices
- Payment reminders
- Client payment history
- Revenue tracking

### 3. Cash Flow
- Income vs expenses
- Runway calculation
- Trend analysis
- Projections

### 4. Financial Insights
- Spending patterns
- Category breakdown
- Recommendations
- Alerts for anomalies

## Commands

### Expenses
- log expense [amount] for [category]
- expenses this month
- spending breakdown
- budget status

### Invoices
- pending invoices
- invoice [client] for [amount]
- payment received from [client]
- overdue invoices

### Overview
- financial summary
- cash flow this month
- runway status
- duit masuk bulan ni

## Data Storage

### Finance Log: ~/clawd/memory/finance.json
{
  \
