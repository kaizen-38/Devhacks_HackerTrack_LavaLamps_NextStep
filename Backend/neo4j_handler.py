from neo4j import GraphDatabase
import json
import os
from dotenv import load_dotenv

uri = os.getenv("uri")
user = os.getenv("user")
password = os.getenv("password")


class Neo4jHandler:
    def __init__(self, uri, user, password):
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

    def close(self):
        self.driver.close()

    def insert_resume(self, resume_data):
        with self.driver.session() as session:
            session.write_transaction(self._insert_resume_tx, resume_data)

    @staticmethod
    def _insert_resume_tx(tx, resume_data):
        resume_data = json.loads(resume_data)
        print("📌 Inserting resume:", resume_data.get("email"))

        email = resume_data.get("email")
        if not email:
            raise ValueError("❌ Resume data missing required field: email")

        # -------- User Node --------
        query = """
        MERGE (u:User {email: $email})
        SET u.first_name   = coalesce($first_name, u.first_name),
            u.middle_name  = coalesce($middle_name, u.middle_name),
            u.last_name    = coalesce($last_name, u.last_name),
            u.contact_no   = coalesce($contact_no, u.contact_no)
        """
        tx.run(query, {
            "email": email,
            "first_name": resume_data.get("first_name"),
            "middle_name": resume_data.get("middle_name"),
            "last_name": resume_data.get("last_name"),
            "contact_no": (resume_data["contact_no"]) if resume_data.get("contact_no") else None
        })

        # -------- Education --------
        for edu in resume_data.get("education", []):
            if not edu.get("university"):
                continue
            query = """
            MATCH (u:User {email: $email})
            MERGE (e:Education {
                university: $university,
                degree: coalesce($degree, ""),
                major: coalesce($major, ""),
                graduation_date: coalesce($graduation_date, "")
            })
            SET e.cgpa = coalesce($cgpa, e.cgpa),
                e.scale = coalesce($scale, e.scale),
                e.minor = coalesce($minor, e.minor)
            MERGE (u)-[:HAS_EDUCATION]->(e)
            """
            tx.run(query, {"email": email, **edu})

        # -------- Experience --------
        for exp in resume_data.get("experience", []):
            if not exp.get("company"):
                continue
            query = """
            MATCH (u:User {email: $email})
            MERGE (x:Experience {
                company: $company,
                position: coalesce($position, "")
            })
            SET x.description = coalesce($description, ""),
                x.start_date = coalesce($start_date, ""),
                x.end_date   = coalesce($end_date, "")
            MERGE (u)-[:HAS_EXPERIENCE]->(x)
            """
            tx.run(query, {"email": email, **exp})

        # -------- Skills --------
        for skill in resume_data.get("skills", []):
            if not skill:
                continue
            query = """
            MATCH (u:User {email: $email})
            MERGE (s:Skill {name: $skill})
            MERGE (u)-[:HAS_SKILL]->(s)
            """
            tx.run(query, {"email": email, "skill": skill})

        # -------- Certifications --------
        for cert in resume_data.get("certifications", []):
            if not cert:
                continue
            query = """
            MATCH (u:User {email: $email})
            MERGE (c:Certification {name: $cert})
            MERGE (u)-[:HAS_CERTIFICATION]->(c)
            """
            tx.run(query, {"email": email, "cert": cert})
