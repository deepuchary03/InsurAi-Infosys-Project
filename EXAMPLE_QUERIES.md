# 🤖 AI Chat Assistant - Example Queries

## How to Use

Send POST requests to: `http://localhost:8081/api/chat`

**Request Format:**
```json
{
  "message": "Your question here"
}
```

**Response Format:**
```json
{
  "response": "AI's answer here"
}
```

---

## Example Queries & Expected Responses

### 1. Agent Queries 👥

**Query:**
```json
{"message": "How many agents are available?"}
```

**Expected Response:**
```
We currently have 3 available agents:
• John Doe (Health Insurance) - Available
• Jane Smith (Life Insurance) - Available
• Mike Johnson (Auto Insurance) - Available

Feel free to book an appointment with any of our available agents!
```

---

**Query:**
```json
{"message": "Can I speak with an agent?"}
```

**Expected Response:**
```
Yes! We have 3 agents available to assist you:
1. John Doe - Specializes in Health Insurance
2. Jane Smith - Specializes in Life Insurance  
3. Mike Johnson - Specializes in Auto Insurance

Would you like to schedule an appointment?
```

---

**Query:**
```json
{"message": "Show me all advisors"}
```

**Expected Response:**
```
Here are all our insurance advisors:

Available:
• John Doe (Health Insurance)
• Jane Smith (Life Insurance)

Currently Unavailable:
• Mike Johnson (Auto Insurance)

Total: 3 agents (2 available now)
```

---

### 2. Insurance Plan Queries 📋

**Query:**
```json
{"message": "What insurance plans do you offer?"}
```

**Expected Response:**
```
We offer 4 comprehensive insurance plans:

1. Basic Health Plan
   - Premium: $100/month
   - Coverage: $50,000
   
2. Premium Health Plan
   - Premium: $200/month
   - Coverage: $100,000
   
3. Life Insurance Plus
   - Premium: $150/month
   - Coverage: $250,000
   
4. Auto Insurance Pro
   - Premium: $120/month
   - Coverage: $75,000

Which plan would you like to know more about?
```

---

**Query:**
```json
{"message": "What's the cheapest plan?"}
```

**Expected Response:**
```
Our most affordable plan is the Basic Health Plan at $100/month, 
providing $50,000 in coverage. It's perfect for individuals seeking 
essential health coverage.

Would you like more details about this plan?
```

---

**Query:**
```json
{"message": "Compare health insurance plans"}
```

**Expected Response:**
```
Here's a comparison of our health insurance plans:

Basic Health Plan:
- $100/month
- $50,000 coverage
- Great for individuals

Premium Health Plan:
- $200/month
- $100,000 coverage
- Best for families

The Premium plan offers double the coverage for only $100 more per month.
```

---

### 3. Appointment Queries 📅

**Query:**
```json
{"message": "How many appointments are scheduled?"}
```

**Expected Response:**
```
We currently have 15 appointments scheduled across all our agents.

If you'd like to book an appointment, please let me know your 
preferred date and time, and I'll connect you with an available agent.
```

---

**Query:**
```json
{"message": "Can I book an appointment?"}
```

**Expected Response:**
```
Absolutely! We have 3 available agents ready to meet with you.

To schedule an appointment:
1. Choose your preferred agent
2. Select a date and time
3. Provide your contact information

Our agents specialize in:
• Health Insurance - John Doe
• Life Insurance - Jane Smith
• Auto Insurance - Mike Johnson

Which type of insurance are you interested in?
```

---

### 4. General Insurance Queries 💡

**Query:**
```json
{"message": "What is insurance?"}
```

**Expected Response:**
```
Insurance is a contract between you and an insurance company where 
you pay regular premiums in exchange for financial protection against 
specific risks or losses.

We offer several types of insurance:
- Health Insurance (2 plans available)
- Life Insurance (1 plan available)
- Auto Insurance (1 plan available)

Would you like to learn more about any specific type?
```

---

**Query:**
```json
{"message": "Why do I need insurance?"}
```

**Expected Response:**
```
Insurance provides financial security and peace of mind by:

1. Protecting against unexpected medical expenses
2. Securing your family's financial future
3. Covering vehicle repairs or replacement
4. Reducing out-of-pocket costs for major life events

With our plans starting at just $100/month, you can get comprehensive 
coverage tailored to your needs. Would you like to explore our options?
```

---

### 5. Mixed Queries 🔄

**Query:**
```json
{"message": "I need health insurance and want to talk to someone"}
```

**Expected Response:**
```
Great! We can help with that.

Health Insurance Plans:
• Basic Health Plan - $100/month, $50,000 coverage
• Premium Health Plan - $200/month, $100,000 coverage

Available Health Insurance Specialist:
• John Doe - Available now

Would you like to:
1. Get more details about our health plans?
2. Schedule an appointment with John Doe?
```

---

## Testing with cURL

### Get Agent Info:
```bash
curl -X POST http://localhost:8081/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"message": "How many agents are available?"}'
```

### Get Plan Info:
```bash
curl -X POST http://localhost:8081/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"message": "What insurance plans do you have?"}'
```

### General Question:
```bash
curl -X POST http://localhost:8081/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"message": "What is life insurance?"}'
```

---

## Testing with Postman

1. **Set Method**: POST
2. **Set URL**: `http://localhost:8081/api/chat`
3. **Headers**:
   - `Content-Type: application/json`
   - `Authorization: Bearer YOUR_JWT_TOKEN`
4. **Body** (raw JSON):
   ```json
   {
     "message": "Your question here"
   }
   ```

---

## Keywords That Trigger Database Queries

The AI automatically queries the database when it detects:

| Keyword | Database Query |
|---------|---------------|
| "agent", "advisor" | Fetches agent data |
| "plan", "policy", "insurance" | Fetches insurance plans |
| "appointment", "meeting" | Fetches appointments |

### Examples:
- ✅ "Show me **agents**" → Queries AgentRepository
- ✅ "What **insurance plans**" → Queries PlanRepository  
- ✅ "Book an **appointment**" → Queries AppointmentRepository
- ✅ "Tell me about **advisors** and **plans**" → Queries both!

---

## Edge Cases

### No Data in Database:
**Query:** `{"message": "How many agents are available?"}`

**Response:**
```
We currently have 0 agents available. 
Please check back later or contact support.
```

### Multiple Topics:
**Query:** `{"message": "What agents and plans are available?"}`

**Response:**
```
AGENTS:
- Total agents: 3
- Available: 2

PLANS:
- Basic Health: $100/month
- Premium Health: $200/month
...
```

---

## Pro Tips 💡

1. **Be specific**: "Show me health insurance agents" is better than "agents"
2. **Ask follow-ups**: AI remembers context within the session
3. **Use natural language**: "I need help choosing insurance" works great
4. **Combine queries**: "What plans do you have and who can help me?"

---

## Need More Examples?

Check out:
- `AI_SETUP.md` - Setup guide
- `CHANGES_SUMMARY.md` - Recent updates
- API documentation in your project

Happy testing! 🚀
