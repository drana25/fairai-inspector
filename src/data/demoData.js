/**
 * Pre-loaded demo analyses for Demo Mode — no auth needed.
 */
export const DEMO_ANALYSES = [
  {
    id: 'demo-1',
    datasetName: 'HR Hiring Dataset 2023',
    fairnessScore: 61,
    rowCount: 1247,
    createdAt: '2025-12-15T10:30:00Z',
    columns: {
      gender: {
        groups: [
          { name: 'Male', total: 742, positive: 542, rate: 0.73 },
          { name: 'Female', total: 505, positive: 258, rate: 0.51 },
        ],
        majorityGroup: 'Male',
        minorityGroup: 'Female',
        majorityRate: 0.73,
        minorityRate: 0.51,
        dir: 0.699,
        spd: -0.22,
        verdict: 'FAIL',
      },
      age_group: {
        groups: [
          { name: '25-34', total: 410, positive: 295, rate: 0.72 },
          { name: '35-44', total: 380, positive: 260, rate: 0.684 },
          { name: '45-54', total: 290, positive: 180, rate: 0.621 },
          { name: '55+', total: 167, positive: 98, rate: 0.587 },
        ],
        majorityGroup: '25-34',
        minorityGroup: '55+',
        majorityRate: 0.72,
        minorityRate: 0.587,
        dir: 0.815,
        spd: -0.133,
        verdict: 'WARNING',
      },
    },
    explanations: {
      gender:
        'Female candidates have a 22% lower hiring rate than male candidates (DIR: 0.70), falling below the legal 0.8 threshold. This may reflect historical bias in how training data was collected. Recommended action: audit training data for underrepresentation and review whether selection criteria are genuinely role-relevant.',
      age_group:
        'There is a 13% gap between 25-34 and 55+ age groups (DIR: 0.82), which is close to the 0.8 concern threshold. This suggests a potential pattern worth monitoring. Consider reviewing recent hiring decisions for older candidates and tracking this metric over the next quarter.',
    },
  },
  {
    id: 'demo-2',
    datasetName: 'Loan Approval Model Q4 2025',
    fairnessScore: 43,
    rowCount: 3892,
    createdAt: '2026-01-20T14:15:00Z',
    columns: {
      race: {
        groups: [
          { name: 'White', total: 1850, positive: 1388, rate: 0.75 },
          { name: 'Black', total: 820, positive: 410, rate: 0.5 },
          { name: 'Hispanic', total: 690, positive: 380, rate: 0.551 },
          { name: 'Asian', total: 532, positive: 372, rate: 0.699 },
        ],
        majorityGroup: 'White',
        minorityGroup: 'Black',
        majorityRate: 0.75,
        minorityRate: 0.5,
        dir: 0.667,
        spd: -0.25,
        verdict: 'FAIL',
      },
      gender: {
        groups: [
          { name: 'Male', total: 2100, positive: 1470, rate: 0.7 },
          { name: 'Female', total: 1792, positive: 1147, rate: 0.64 },
        ],
        majorityGroup: 'Male',
        minorityGroup: 'Female',
        majorityRate: 0.7,
        minorityRate: 0.64,
        dir: 0.857,
        spd: -0.06,
        verdict: 'WARNING',
      },
    },
    explanations: {
      race:
        'Black applicants have a 25% lower approval rate than White applicants (DIR: 0.67), which falls significantly below the 0.8 threshold. This may indicate systemic patterns in historical lending data. Recommended action: immediately audit the training dataset for representation balance and review feature selection for proxy discrimination.',
      gender:
        'There is a 6% gap between Male and Female approval rates (DIR: 0.86), which is close to the concern threshold. This suggests a mild pattern that should be watched. Consider conducting a deeper analysis on income-adjusted approval rates.',
    },
  },
  {
    id: 'demo-3',
    datasetName: 'Medical Eligibility Screening',
    fairnessScore: 91,
    rowCount: 2156,
    createdAt: '2026-03-05T09:45:00Z',
    columns: {
      gender: {
        groups: [
          { name: 'Male', total: 1100, positive: 880, rate: 0.8 },
          { name: 'Female', total: 1056, positive: 832, rate: 0.788 },
        ],
        majorityGroup: 'Male',
        minorityGroup: 'Female',
        majorityRate: 0.8,
        minorityRate: 0.788,
        dir: 0.985,
        spd: -0.012,
        verdict: 'PASS',
      },
    },
    explanations: {
      gender:
        'The "gender" category shows similar outcome rates across Male and Female groups (DIR: 0.99), meeting fairness standards. Continue monitoring to maintain this balance. No immediate action required, but periodic review is recommended.',
    },
  },
];

/**
 * Sample CSV data for "Try with sample data" feature
 */
export const SAMPLE_CSV = `name,gender,race,age_group,experience_years,education,hired
John Smith,Male,White,25-34,5,Bachelor,1
Sarah Johnson,Female,White,25-34,6,Master,1
Michael Brown,Male,Black,35-44,8,Bachelor,1
Emily Davis,Female,White,25-34,3,Bachelor,0
James Wilson,Male,White,35-44,10,PhD,1
Maria Garcia,Female,Hispanic,25-34,4,Bachelor,0
Robert Taylor,Male,White,45-54,15,Master,1
Jennifer Lee,Female,Asian,25-34,5,Master,1
David Martinez,Male,Hispanic,35-44,7,Bachelor,1
Lisa Anderson,Female,White,35-44,9,Master,1
William Thomas,Male,Black,25-34,3,Bachelor,0
Jessica White,Female,White,25-34,4,Bachelor,0
Christopher Harris,Male,White,25-34,6,Bachelor,1
Amanda Clark,Female,Black,35-44,8,Master,0
Daniel Lewis,Male,White,45-54,12,Bachelor,1
Michelle Robinson,Female,Hispanic,25-34,3,Bachelor,0
Matthew Walker,Male,Asian,35-44,9,Master,1
Ashley Hall,Female,White,25-34,5,Bachelor,1
Anthony Allen,Male,White,25-34,4,Bachelor,1
Stephanie Young,Female,Black,25-34,3,Bachelor,0
Kevin King,Male,White,35-44,11,PhD,1
Nicole Wright,Female,White,35-44,7,Master,1
Brian Scott,Male,Hispanic,25-34,5,Bachelor,1
Samantha Green,Female,White,25-34,2,Bachelor,0
Jason Adams,Male,White,45-54,14,Master,1
Rebecca Baker,Female,Asian,35-44,8,Master,1
Ryan Nelson,Male,Black,25-34,4,Bachelor,0
Laura Carter,Female,White,25-34,5,Bachelor,1
Eric Mitchell,Male,White,35-44,9,Bachelor,1
Rachel Perez,Female,Hispanic,25-34,3,Bachelor,0
Justin Roberts,Male,White,25-34,6,Master,1
Megan Turner,Female,White,35-44,8,Bachelor,0
Brandon Phillips,Male,Asian,25-34,5,Bachelor,1
Amber Campbell,Female,Black,25-34,3,Bachelor,0
Tyler Parker,Male,White,25-34,4,Bachelor,1
Danielle Evans,Female,White,35-44,10,PhD,1
Aaron Edwards,Male,White,45-54,13,Master,1
Christina Collins,Female,Hispanic,35-44,6,Bachelor,0
Sean Stewart,Male,Black,35-44,7,Bachelor,1
Brittany Sanchez,Female,White,25-34,4,Bachelor,0
Nathan Morris,Male,White,25-34,5,Bachelor,1
Heather Rogers,Female,Asian,25-34,6,Master,1
Patrick Reed,Male,White,35-44,8,Bachelor,1
Tiffany Cook,Female,White,25-34,3,Bachelor,0
Kyle Morgan,Male,Hispanic,25-34,4,Bachelor,1
Kayla Bell,Female,Black,35-44,5,Bachelor,0
Derrick Murphy,Male,White,45-54,11,Master,1
Courtney Bailey,Female,White,25-34,4,Bachelor,0
Marcus Rivera,Male,White,35-44,7,Bachelor,1
Vanessa Cooper,Female,Hispanic,25-34,3,Bachelor,0
Trevor Richardson,Male,Asian,35-44,9,PhD,1
Lindsey Cox,Female,White,25-34,5,Bachelor,1
Cody Howard,Male,White,25-34,6,Bachelor,1
Chelsea Ward,Female,Black,25-34,2,Bachelor,0
Blake Torres,Male,White,35-44,8,Master,1
Paige Peterson,Female,White,35-44,7,Bachelor,1
Grant Gray,Male,Hispanic,25-34,5,Bachelor,1
Holly Ramirez,Female,White,25-34,3,Bachelor,0
Derek James,Male,White,45-54,14,PhD,1
Natalie Watson,Female,Asian,35-44,8,Master,1
Cameron Brooks,Male,Black,25-34,4,Bachelor,0
Melanie Kelly,Female,White,25-34,5,Bachelor,1
Logan Sanders,Male,White,35-44,10,Master,1
Jasmine Price,Female,Hispanic,25-34,3,Bachelor,0
Corey Bennett,Male,White,25-34,5,Bachelor,1
Kimberly Wood,Female,White,25-34,4,Bachelor,0
Peter Barnes,Male,Asian,35-44,7,Bachelor,1
Diana Ross,Female,Black,35-44,6,Master,0
Shane Henderson,Male,White,25-34,5,Bachelor,1
Monica Coleman,Female,White,45-54,12,PhD,1
Victor Jenkins,Male,Hispanic,35-44,8,Bachelor,1
Crystal Perry,Female,White,25-34,3,Bachelor,0
Dustin Powell,Male,White,25-34,6,Master,1
Erica Long,Female,Black,25-34,3,Bachelor,0
Chad Patterson,Male,White,35-44,9,Bachelor,1
Valerie Hughes,Female,Asian,25-34,5,Master,1
Joel Flores,Male,White,45-54,11,Bachelor,1
Angela Washington,Female,Hispanic,35-44,4,Bachelor,0
Ross Butler,Male,White,25-34,4,Bachelor,1
Kathryn Simmons,Female,White,25-34,5,Bachelor,1
Derek Foster,Male,Black,35-44,7,Bachelor,1
Jenna Bryant,Female,White,25-34,3,Bachelor,0
Troy Alexander,Male,White,35-44,10,PhD,1
Leah Russell,Female,Asian,35-44,8,Master,1
Max Griffin,Male,Hispanic,25-34,5,Bachelor,1
Adrienne Diaz,Female,White,25-34,4,Bachelor,0
Lance Hayes,Male,White,45-54,13,Master,1
Candice Myers,Female,Black,25-34,2,Bachelor,0
Carl Ford,Male,White,25-34,5,Bachelor,1
Brooke Hamilton,Female,White,35-44,7,Bachelor,1
Eduardo Graham,Male,Asian,35-44,9,Master,1
Erin Sullivan,Female,Hispanic,25-34,3,Bachelor,0
Henry Wallace,Male,White,25-34,6,Bachelor,1
Priscilla West,Female,White,35-44,8,PhD,1
Frank Jordan,Male,Black,25-34,4,Bachelor,0
Gloria Owens,Female,White,45-54,10,Master,1
Ivan Reynolds,Male,White,25-34,5,Bachelor,1
Nina Ellis,Female,Hispanic,35-44,5,Bachelor,0`;

export function isDemoMode() {
  return localStorage.getItem('fairai_demo') === 'true';
}

export function setDemoMode() {
  localStorage.setItem('fairai_demo', 'true');
}

export function clearDemoMode() {
  localStorage.removeItem('fairai_demo');
}
