from neo4j import GraphDatabase

# Connect to AuraDB (replace with your AuraDB URI, username, password)
uri = "neo4j+s://a885d780.databases.neo4j.io"
username = "a885d780"
password = "Tu6awaQAlD0Rr9B3rygMbW1GfgSp6tH9t8lvMsJRvRo"

driver = GraphDatabase.driver(uri, auth=(username, password))

# Function to create User and related nodes
def create_user(tx, user_data):
    query = """
    MERGE (u:User {email: $email})
      ON CREATE SET u.first_name = $first_name,
                    u.middle_name = $middle_name,
                    u.last_name = $last_name,
                    u.contact_no = $contact_no

    WITH u
    UNWIND $education AS edu
      MERGE (e:Education {university: edu.university, degree: edu.degree, major: edu.major})
        ON CREATE SET e.cgpa = edu.cgpa,
                      e.cgpa_scale = edu.scale,
                      e.minor = edu.minor,
                      e.graduation_date = edu.graduation_date
      MERGE (u)-[:HAS_EDUCATION]->(e)

    WITH u
    UNWIND $experience AS exp
      MERGE (ex:Experience {company: exp.company, position: exp.position})
        ON CREATE SET ex.description = exp.description,
                      ex.start_date = exp.start_date,
                      ex.end_date = exp.end_date
      MERGE (u)-[:HAS_EXPERIENCE]->(ex)

    WITH u
    UNWIND $skills AS skill
      MERGE (s:Skill {name: skill})
      MERGE (u)-[:HAS_SKILL]->(s)

    WITH u
    UNWIND $certifications AS cert
      MERGE (c:Certification {name: cert.name})
      MERGE (u)-[:HAS_CERTIFICATION]->(c)
    """
    tx.run(query, **user_data)

# Example user JSON
user_data = {
    "first_name": "Krish",
    "middle_name": None,
    "last_name": "Patel",
    "contact_no": 1234567890,
    "email": "krish@example.com",
    "education": [
        {
            "university": "ABC University",
            "degree": "Bachelors",
            "major": "Computer Science",
            "cgpa": 3.8,
            "scale": 4.0,
            "minor": ["Math", "AI"],
            "graduation_date": "2025-05-01"
        }
    ],
    "experience": [
        {
            "company": "Neurapses",
            "position": "Machine Learning Intern",
            "description": "Worked on drug recommendation system",
            "start_date": "2024-05-27",
            "end_date": "2024-07-05"
        }
    ],
    "skills": ["Python", "Neo4j", "Machine Learning", "AI"],
    "certifications": [
        {"name": "AWS Certified Cloud Practitioner"}
    ]
}

# Run insertion
with driver.session() as session:
    session.execute_write(create_user, user_data)

print("User and related nodes created successfully!")

