# Vacancies Feature - Implementation

## What's New

Recruiters can now specify the number of vacancies available for each job posting.

## Changes Made

### 1. Database Model Update
**File**: `server/models/JobPosting.js`

Added vacancies field:
```javascript
vacancies: { type: Number, default: 1, min: 1 }
```

- Type: Number
- Default: 1
- Minimum: 1

### 2. Frontend Form Update
**File**: `client/src/pages/RecruiterDashboard.jsx`

Added to form data:
```javascript
const [formData, setFormData] = useState({
  title: '',
  description: '',
  requiredSkills: '',
  experience: '',
  salary: '',
  location: '',
  vacancies: 1  // New field
})
```

Added input field:
```jsx
<input
  type="number"
  name="vacancies"
  placeholder="Number of Vacancies"
  value={formData.vacancies}
  onChange={handleJobFormChange}
  min="1"
  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
/>
```

### 3. Job Display Update
**File**: `client/src/pages/RecruiterDashboard.jsx`

Added vacancies display in job list:
```jsx
<div>
  <p className="text-gray-500 text-sm">Vacancies</p>
  <p className="text-white font-semibold">{job.vacancies || 1}</p>
</div>
```

## How It Works

### Posting a Job
1. Recruiter clicks "Post New Job"
2. Fills in job details
3. Enters number of vacancies (default: 1)
4. Clicks "Post Job"
5. Job is created with vacancies count

### Viewing Jobs
1. Recruiter sees all posted jobs
2. Each job shows:
   - Title
   - Experience required
   - Salary
   - Location
   - **Vacancies** (new)
   - Posted date
   - Required skills

## API Request

```javascript
{
  title: "Senior Developer",
  description: "...",
  requiredSkills: ["Python", "Django"],
  experience: "5+ years",
  salary: "$100k-$150k",
  location: "Remote",
  vacancies: 3  // New field
}
```

## Database Schema

```javascript
{
  recruiterId: ObjectId,
  title: String,
  description: String,
  requiredSkills: [String],
  experience: String,
  salary: String,
  location: String,
  vacancies: Number,  // New field
  status: String,
  createdAt: Date
}
```

## Features

✓ Recruiters can specify number of vacancies
✓ Default value: 1
✓ Minimum value: 1
✓ Displayed in job list
✓ Stored in database
✓ Easy to update

## Testing

1. Login as recruiter
2. Click "Post New Job"
3. Fill in job details
4. Enter vacancies: 3
5. Click "Post Job"
6. Verify vacancies shows in job list

## Files Modified

1. `server/models/JobPosting.js` - Added vacancies field
2. `client/src/pages/RecruiterDashboard.jsx` - Added form input and display

## Success Criteria

✓ Vacancies field appears in job form
✓ Default value is 1
✓ Can enter any number ≥ 1
✓ Vacancies displayed in job list
✓ Data saved to database
✓ No console errors

Ready to test!
