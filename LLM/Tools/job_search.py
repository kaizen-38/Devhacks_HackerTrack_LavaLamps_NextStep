from typing import Any, Dict, Sequence, List
from langchain_core.tools import Tool
from langflow.base.langchain_utilities.model import LCToolComponent
from langflow.inputs import SecretStrInput
from langflow.io import Output
import requests
import logging
from datetime import datetime
import re
from urllib.parse import quote

class JSearchComponent(LCToolComponent):
    """JSSearch component for job search with natural language query parsing"""
    display_name: str = "Job Search"
    description: str = "Search jobs using JSSearch API with natural language queries"
    name = "JSearch"
    icon = "Briefcase"
    inputs = [
        SecretStrInput(
            name="rapidapi_key",
            display_name="RapidAPI Key",
            required=True,
            info="Your RapidAPI key for JSSearch API"
        ),
    ]
    outputs = [Output(name="tools", display_name="Tools", method="build_tools")]

    def parse_job_query(self, query: str) -> Dict[str, Any]:
        """Parse natural language query to extract job search parameters"""
        job_params = {}
        
        # Extract job title/keywords - look for patterns like "Python developer", "software engineer", etc.
        job_title_patterns = [
            r'(?:looking for|find|search for)\s+([^,]+?)(?:\s+jobs?\s+in|\s+in|\s*$)',
            r'^([^,]+?)(?:\s+jobs?\s+in|\s+in)',
            r'jobs?\s+for\s+([^,]+?)(?:\s+in|\s*$)',
        ]
        
        job_title = None
        for pattern in job_title_patterns:
            match = re.search(pattern, query, re.IGNORECASE)
            if match:
                job_title = match.group(1).strip()
                break
        
        if not job_title:
            # If no pattern matched, use the whole query as job title
            job_title = query.split(' in ')[0] if ' in ' in query else query
        
        # Extract location
        location_patterns = [
            r'\bin\s+([^,]+?)(?:\s*,|\s*$)',
            r'\bat\s+([^,]+?)(?:\s*,|\s*$)',
            r'location[:\s]+([^,]+?)(?:\s*,|\s*$)',
        ]
        
        location = None
        for pattern in location_patterns:
            match = re.search(pattern, query, re.IGNORECASE)
            if match:
                location = match.group(1).strip()
                break
        
        # Combine job title and location for the main query
        if location:
            search_query = f"{job_title} jobs in {location}"
        else:
            search_query = f"{job_title} jobs"
        
        job_params["query"] = search_query
        
        # Set default parameters
        job_params.update({
            "page": "1",
            "num_pages": "1",
            "country": "us",
            "date_posted": "all"
        })
        
        # Extract specific parameters from query if mentioned
        # Page number
        page_match = re.search(r'page\s+(\d+)', query, re.IGNORECASE)
        if page_match:
            job_params["page"] = page_match.group(1)
        
        # Number of pages
        pages_match = re.search(r'(\d+)\s+pages?', query, re.IGNORECASE)
        if pages_match:
            job_params["num_pages"] = pages_match.group(1)
        
        # Country
        country_patterns = [
            (r'\bin\s+(?:the\s+)?uk(?:\s|$)', "uk"),
            (r'\bin\s+(?:the\s+)?united\s+kingdom(?:\s|$)', "uk"),
            (r'\bin\s+(?:the\s+)?usa?(?:\s|$)', "us"),
            (r'\bin\s+(?:the\s+)?united\s+states(?:\s|$)', "us"),
            (r'\bin\s+canada(?:\s|$)', "ca"),
            (r'\bin\s+australia(?:\s|$)', "au"),
            (r'\bin\s+germany(?:\s|$)', "de"),
            (r'\bin\s+france(?:\s|$)', "fr"),
            (r'\bin\s+india(?:\s|$)', "in"),
        ]
        
        for pattern, country_code in country_patterns:
            if re.search(pattern, query, re.IGNORECASE):
                job_params["country"] = country_code
                break
        
        # Date posted
        date_patterns = [
            (r'today', "today"),
            (r'yesterday', "yesterday"),
            (r'3\s*days?', "3days"),
            (r'week', "week"),
            (r'month', "month"),
            (r'all\s*time', "all"),
        ]
        
        for pattern, date_value in date_patterns:
            if re.search(pattern, query, re.IGNORECASE):
                job_params["date_posted"] = date_value
                break
        
        return job_params

    def search_jobs(self, query: str) -> Dict[str, Any]:
        """Execute job search with natural language query"""
        try:
            url = "https://jsearch.p.rapidapi.com/search"
            
            # Parse query to get search parameters
            search_params = self.parse_job_query(query)
            
            headers = {
                'X-RapidAPI-Key': self.rapidapi_key,
                'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
            }
            
            logging.info(f"Making request to JSSearch API with params: {search_params}")
            response = requests.get(url, params=search_params, headers=headers)
            response.raise_for_status()
            results = response.json()
            
            return {
                "status": "success",
                "job_results": {
                    "data": results,
                    "metadata": {
                        "query": query,
                        "search_params": search_params,
                        "timestamp": datetime.now().isoformat(),
                        "total_jobs": results.get("data", []) and len(results.get("data", [])),
                        "parameters_used": results.get("parameters", {})
                    }
                }
            }
            
        except requests.exceptions.RequestException as e:
            return {
                "status": "error",
                "message": f"API request failed: {str(e)}",
                "jobs": []
            }
        except Exception as e:
            return {
                "status": "error",
                "message": f"Unexpected error: {str(e)}",
                "jobs": []
            }

    def search_jobs_advanced(self, 
                           query: str,
                           page: int = 1,
                           num_pages: int = 1,
                           country: str = "us",
                           date_posted: str = "all",
                           employment_types: str = None,
                           job_requirements: str = None,
                           remote_jobs_only: bool = False) -> Dict[str, Any]:
        """Execute advanced job search with specific parameters"""
        try:
            url = "https://jsearch.p.rapidapi.com/search"
            
            search_params = {
                "query": query,
                "page": str(page),
                "num_pages": str(num_pages),
                "country": country,
                "date_posted": date_posted
            }
            
            # Add optional parameters if provided
            if employment_types:
                search_params["employment_types"] = employment_types
            if job_requirements:
                search_params["job_requirements"] = job_requirements
            if remote_jobs_only:
                search_params["remote_jobs_only"] = "true"
            
            headers = {
                'X-RapidAPI-Key': self.rapidapi_key,
                'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
            }
            
            logging.info(f"Making advanced request to JSSearch API with params: {search_params}")
            response = requests.get(url, params=search_params, headers=headers)
            response.raise_for_status()
            results = response.json()
            
            return {
                "status": "success",
                "job_results": {
                    "data": results,
                    "metadata": {
                        "search_params": search_params,
                        "timestamp": datetime.now().isoformat(),
                        "total_jobs": results.get("data", []) and len(results.get("data", [])),
                        "parameters_used": results.get("parameters", {})
                    }
                }
            }
            
        except requests.exceptions.RequestException as e:
            return {
                "status": "error",
                "message": f"API request failed: {str(e)}",
                "jobs": []
            }
        except Exception as e:
            return {
                "status": "error",
                "message": f"Unexpected error: {str(e)}",
                "jobs": []
            }

    def get_job_details(self, job_id: str, extended_publisher_details: bool = False) -> Dict[str, Any]:
        """Get detailed information for a specific job"""
        try:
            url = "https://jsearch.p.rapidapi.com/job-details"
            
            params = {
                "job_id": job_id
            }
            
            if extended_publisher_details:
                params["extended_publisher_details"] = "true"
            
            headers = {
                'X-RapidAPI-Key': self.rapidapi_key,
                'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
            }
            
            response = requests.get(url, headers=headers, params=params)
            response.raise_for_status()
            results = response.json()
            
            return {
                "status": "success",
                "job_details": results,
                "metadata": {
                    "job_id": job_id,
                    "timestamp": datetime.now().isoformat()
                }
            }
            
        except requests.exceptions.RequestException as e:
            return {
                "status": "error",
                "message": f"Failed to get job details: {str(e)}",
                "job_details": {}
            }
        except Exception as e:
            return {
                "status": "error",
                "message": f"Unexpected error: {str(e)}",
                "job_details": {}
            }

    def search_salary_estimates(self, job_title: str, location: str = None, radius: int = 100) -> Dict[str, Any]:
        """Get salary estimates for a job title and location"""
        try:
            url = "https://jsearch.p.rapidapi.com/estimated-salary"
            
            params = {
                "job_title": job_title,
                "radius": str(radius)
            }
            
            if location:
                params["location"] = location
            
            headers = {
                'X-RapidAPI-Key': self.rapidapi_key,
                'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
            }
            
            response = requests.get(url, headers=headers, params=params)
            response.raise_for_status()
            results = response.json()
            
            return {
                "status": "success",
                "salary_estimates": results,
                "metadata": {
                    "job_title": job_title,
                    "location": location,
                    "radius": radius,
                    "timestamp": datetime.now().isoformat()
                }
            }
            
        except requests.exceptions.RequestException as e:
            return {
                "status": "error",
                "message": f"Failed to get salary estimates: {str(e)}",
                "salary_estimates": {}
            }
        except Exception as e:
            return {
                "status": "error",
                "message": f"Unexpected error: {str(e)}",
                "salary_estimates": {}
            }

    def build_tools(self) -> Sequence[Tool]:
        """Build and return the JSSearch tools"""
        tools = [
            Tool(
                name="search_jobs",
                description="""
                Search for jobs using natural language queries.
                The query can include:
                - Job title/keywords (e.g., 'Python developer', 'software engineer')
                - Location (e.g., 'in Chicago', 'in New York')
                - Time frame (e.g., 'today', 'this week', 'this month')
                - Country (e.g., 'in USA', 'in UK', 'in Canada')
                - Page information (e.g., 'page 2', '3 pages')
                
                Example queries:
                - 'Find Python developer jobs in Chicago'
                - 'Software engineer jobs in San Francisco posted this week'
                - 'Remote data scientist positions in USA'
                - 'Marketing manager jobs in London UK'
                """,
                func=self.search_jobs,
            ),
            Tool(
                name="search_jobs_advanced",
                description="""
                Advanced job search with specific parameters.
                Parameters:
                - query: Job search query (required)
                - page: Page number (default: 1)
                - num_pages: Number of pages to fetch (default: 1)
                - country: Country code (us, uk, ca, au, de, fr, in, etc.)
                - date_posted: all, today, 3days, week, month
                - employment_types: FULLTIME, PARTTIME, CONTRACTOR, INTERN
                - job_requirements: under_3_years_experience, more_than_3_years_experience, no_experience, no_degree
                - remote_jobs_only: True/False
                
                Example usage:
                search_jobs_advanced("software engineer", page=1, country="us", date_posted="week", remote_jobs_only=True)
                """,
                func=self.search_jobs_advanced,
            ),
            Tool(
                name="get_job_details",
                description="""
                Get detailed information for a specific job using job ID.
                Parameters:
                - job_id: The unique identifier for the job (required)
                - extended_publisher_details: Get extended publisher info (optional, default: False)
                
                Example usage:
                get_job_details("abc123xyz")
                """,
                func=self.get_job_details,
            ),
            Tool(
                name="search_salary_estimates",
                description="""
                Get salary estimates for a specific job title and location.
                Parameters:
                - job_title: The job title to search for (required)
                - location: Location for salary estimates (optional)
                - radius: Search radius in miles (default: 100)
                
                Example usage:
                search_salary_estimates("Software Engineer", "San Francisco", 50)
                """,
                func=self.search_salary_estimates,
            )
        ]
        return tools
