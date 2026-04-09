import json
from typing import List
import random

class QuestionGenerator:
    # Domain-specific questions
    DOMAIN_QUESTIONS = {
        "full stack developer": {
            "technical": [
                "Explain the difference between var, let, and const in JavaScript. When would you use each?",
                "What is the virtual DOM in React? How does it improve performance?",
                "Describe the difference between SQL and NoSQL databases. When would you use each?",
                "What are REST APIs? How do you design a RESTful API?",
                "Explain the MVC architecture and how it applies to full stack development.",
                "What is the difference between authentication and authorization?",
                "How do you handle database transactions and ACID properties?",
                "Explain the concept of middleware in web applications.",
                "What is the difference between synchronous and asynchronous programming?",
                "How do you optimize database queries for performance?",
            ],
            "coding": [
                "Write a REST API endpoint to fetch user data with pagination and filtering.",
                "Implement a function to hash and verify passwords securely.",
                "Write code to implement a simple caching mechanism for database queries.",
                "Create a function that validates and sanitizes user input to prevent SQL injection.",
                "Write code to implement JWT-based authentication.",
            ],
            "scenario": [
                "Design a full stack architecture for a real-time chat application.",
                "How would you handle a situation where your database is becoming a bottleneck?",
                "A user reports that their data is not syncing between frontend and backend. How do you debug?",
                "How would you implement a feature that requires real-time updates to multiple users?",
                "Design a scalable architecture for an e-commerce platform with millions of users.",
            ],
            "behavioral": [
                "Tell us about a full stack project you're proud of. What made it successful?",
                "Describe a time you had to debug a complex issue spanning frontend and backend.",
                "How do you approach learning new technologies and frameworks?",
                "Tell us about a time you had to work with both frontend and backend teams.",
                "Describe your approach to writing clean, maintainable, and scalable code.",
            ]
        },
        "data analyst": {
            "technical": [
                "Explain the difference between INNER JOIN, LEFT JOIN, and FULL OUTER JOIN in SQL.",
                "What is the difference between correlation and causation? Why is this important?",
                "How would you handle missing data in a dataset? What are the trade-offs?",
                "Explain what a pivot table is and when you would use it.",
                "What is the difference between descriptive and predictive analytics?",
                "How do you identify and handle outliers in a dataset?",
                "Explain the concept of data normalization and why it's important.",
                "What is A/B testing? How would you design an A/B test?",
                "Describe the steps in a typical data analysis project.",
                "What is the difference between population and sample in statistics?",
            ],
            "coding": [
                "Write SQL to find the top 5 customers by total purchase amount.",
                "Write a query to calculate the month-over-month growth rate for sales.",
                "Create a function to calculate the standard deviation of a list of numbers.",
                "Write SQL to identify duplicate records in a table.",
                "Write a query to find customers who made purchases in all 12 months.",
            ],
            "scenario": [
                "You're asked to analyze why sales dropped 20% last month. What's your approach?",
                "How would you validate the quality of data from a new data source?",
                "A stakeholder asks for a metric that doesn't exist. How do you handle it?",
                "You discover an error in historical data. How do you communicate this?",
                "How would you present complex findings to non-technical stakeholders?",
            ],
            "behavioral": [
                "Tell us about a time you discovered an important insight from data.",
                "Describe a situation where data contradicted a business assumption.",
                "How do you approach learning new tools or programming languages?",
                "Tell us about a time you had to explain technical concepts to non-technical people.",
                "Describe your experience working with cross-functional teams.",
            ]
        },
        "data scientist": {
            "technical": [
                "Explain the difference between supervised and unsupervised learning.",
                "What is overfitting? How do you prevent it?",
                "Explain the bias-variance tradeoff in machine learning.",
                "What is cross-validation and why is it important?",
                "Describe the steps in a typical machine learning project.",
                "What is the difference between classification and regression?",
                "Explain how a decision tree works and when you'd use one.",
                "What is feature engineering? Why is it important?",
                "Explain the difference between precision and recall. When would you optimize for each?",
                "What is regularization? Explain L1 and L2 regularization.",
            ],
            "coding": [
                "Write code to split a dataset into training and testing sets with stratification.",
                "Implement a function to calculate the accuracy, precision, and recall of a model.",
                "Write code to normalize features in a dataset using min-max scaling.",
                "Create a function to perform k-fold cross-validation.",
                "Write code to identify and remove highly correlated features.",
            ],
            "scenario": [
                "You built a model with 95% accuracy, but it performs poorly in production. Why?",
                "How would you approach building a model with limited labeled data?",
                "A model shows bias against a particular demographic. How do you address it?",
                "You need to explain model predictions to non-technical stakeholders. How?",
                "How would you handle a situation where new data distribution differs from training data?",
            ],
            "behavioral": [
                "Tell us about a machine learning project you're proud of. What made it successful?",
                "Describe a time a model you built didn't work as expected. What did you learn?",
                "How do you stay updated with machine learning research and techniques?",
                "Tell us about a time you had to collaborate with engineers to deploy a model.",
                "Describe your approach to documenting and explaining your work.",
            ]
        },
        "aiml engineer": {
            "technical": [
                "Explain how transformers work and why they're better than RNNs for NLP.",
                "What is attention mechanism? How does it work in neural networks?",
                "Explain the difference between CNN and RNN. When would you use each?",
                "What is backpropagation? How does it work?",
                "Describe the architecture of a typical deep learning model.",
                "What is transfer learning? When and why would you use it?",
                "Explain the difference between batch normalization and layer normalization.",
                "What is dropout? Why is it used in neural networks?",
                "Describe how you would approach training a large language model.",
                "What are the ethical considerations in AI/ML development?",
            ],
            "coding": [
                "Write code to build and train a simple neural network using TensorFlow/PyTorch.",
                "Implement a function to perform data augmentation for image data.",
                "Write code to evaluate a classification model using multiple metrics.",
                "Create a function to implement early stopping during model training.",
                "Write code to fine-tune a pre-trained model for a new task.",
            ],
            "scenario": [
                "You need to build a model with limited computational resources. What's your approach?",
                "How would you handle class imbalance in a classification problem?",
                "A model works well in testing but poorly in production. How do you debug?",
                "How would you approach building an AI system that's fair and unbiased?",
                "You need to explain model decisions to stakeholders. How do you approach this?",
            ],
            "behavioral": [
                "Tell us about an AI/ML project that had significant impact.",
                "Describe a time you had to learn a new deep learning framework.",
                "How do you approach staying current with AI/ML advancements?",
                "Tell us about a time you had to balance model accuracy with interpretability.",
                "Describe your experience working on end-to-end ML projects.",
            ]
        },
        "cloud engineer": {
            "technical": [
                "Explain the difference between IaaS, PaaS, and SaaS.",
                "What is containerization? How does Docker work?",
                "Explain Kubernetes and its main components.",
                "What is auto-scaling? How would you configure it?",
                "Describe the difference between vertical and horizontal scaling.",
                "What is a microservices architecture? What are its benefits and challenges?",
                "Explain the concept of Infrastructure as Code (IaC).",
                "What is a CDN? How does it improve performance?",
                "Describe different cloud deployment models (public, private, hybrid).",
                "What are the main security considerations in cloud architecture?",
            ],
            "coding": [
                "Write Terraform code to create a VPC with public and private subnets.",
                "Write a Docker file to containerize a Python application.",
                "Write Kubernetes YAML to deploy an application with auto-scaling.",
                "Write code to implement a CI/CD pipeline using your preferred tool.",
                "Write code to set up monitoring and alerting for a cloud application.",
            ],
            "scenario": [
                "Design a highly available and scalable architecture for an e-commerce platform.",
                "How would you migrate an on-premises application to the cloud?",
                "A cloud application is experiencing high latency. How do you troubleshoot?",
                "How would you implement disaster recovery for a critical application?",
                "Design a cost-optimized architecture for a startup with variable traffic.",
            ],
            "behavioral": [
                "Tell us about a complex cloud infrastructure you designed and implemented.",
                "Describe a time you had to troubleshoot a critical cloud outage.",
                "How do you approach learning new cloud services and technologies?",
                "Tell us about a time you improved cloud infrastructure efficiency.",
                "Describe your experience with cloud security and compliance.",
            ]
        }
    }

    @staticmethod
    def generate_questions(
        job_role: str,
        job_description: str,
        required_skills: List[str],
        candidate_skills: List[str]
    ) -> List[dict]:
        """Generate 10 unique interview questions based on job role"""
        
        # Normalize job role to lowercase
        job_role_lower = job_role.lower().strip()
        
        # Check if job role exists in our domain questions
        if job_role_lower not in QuestionGenerator.DOMAIN_QUESTIONS:
            print(f"Job role '{job_role}' not found. Available roles: {list(QuestionGenerator.DOMAIN_QUESTIONS.keys())}")
            return []
        
        domain_q = QuestionGenerator.DOMAIN_QUESTIONS[job_role_lower]
        
        questions = []
        
        # Add 3 technical questions (randomly selected)
        technical_qs = random.sample(domain_q["technical"], min(3, len(domain_q["technical"])))
        for q in technical_qs:
            questions.append({"question": q, "type": "technical"})
        
        # Add 2 coding questions (randomly selected)
        coding_qs = random.sample(domain_q["coding"], min(2, len(domain_q["coding"])))
        for q in coding_qs:
            questions.append({"question": q, "type": "coding"})
        
        # Add 2 scenario questions (randomly selected)
        scenario_qs = random.sample(domain_q["scenario"], min(2, len(domain_q["scenario"])))
        for q in scenario_qs:
            questions.append({"question": q, "type": "scenario"})
        
        # Add 3 behavioral questions (randomly selected)
        behavioral_qs = random.sample(domain_q["behavioral"], min(3, len(domain_q["behavioral"])))
        for q in behavioral_qs:
            questions.append({"question": q, "type": "behavioral"})
        
        # Shuffle the final list
        random.shuffle(questions)
        
        print(f"✓ Generated 10 unique questions for {job_role}")
        return questions
    
    @staticmethod
    def generate_followup_question(original_question: str, answer: str, question_type: str) -> str:
        """Generate a follow-up question based on the answer"""
        
        if question_type == "technical":
            followups = [
                "That's interesting. Can you dive deeper into the technical aspects? What challenges did you face?",
                "How would you approach this differently if requirements changed?",
                "What testing strategies would you use to ensure your solution is robust?",
                "Can you walk us through the trade-offs you considered?",
                "How did you measure the success of your implementation?",
            ]
        elif question_type == "coding":
            followups = [
                "Can you explain the time and space complexity of your solution?",
                "How would you optimize this further?",
                "What edge cases did you consider?",
                "How would you test this code?",
                "Can you think of an alternative approach?",
            ]
        elif question_type == "scenario":
            followups = [
                "What would you do differently if you faced the same situation again?",
                "How did that experience change your approach?",
                "What was the most important lesson you learned?",
                "How did you measure the impact of your actions?",
                "Can you tell us about a similar situation you handled differently?",
            ]
        else:
            followups = [
                "That's a great example. Can you tell us more?",
                "How did that experience shape your professional approach?",
                "What was the most important lesson you learned?",
                "How would you handle a similar situation today?",
                "Can you give us another example?",
            ]
        
        return random.choice(followups)
