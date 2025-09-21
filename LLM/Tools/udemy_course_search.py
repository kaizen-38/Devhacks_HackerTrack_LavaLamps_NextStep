from typing import Any, Dict, Sequence, List
from langchain_core.tools import Tool
from langflow.base.langchain_utilities.model import LCToolComponent
from langflow.inputs import SecretStrInput
from langflow.io import Output
import requests
import logging
from datetime import datetime

class UdemyCoursesComponent(LCToolComponent):
    """Simple Udemy Paid Courses component for searching free courses"""
    display_name: str = "Udemy Courses Search"
    description: str = "Search Udemy paid courses available for free"
    name = "UdemyCoursesSearch"
    icon = "GraduationCap"
    inputs = [
        SecretStrInput(
            name="rapidapi_key",
            display_name="RapidAPI Key",
            required=True,
            info="Your RapidAPI key for Udemy Paid Courses API"
        ),
    ]
    outputs = [Output(name="tools", display_name="Tools", method="build_tools")]

    def search_courses(self, query: str, page: int = 1, page_size: int = 10) -> Dict[str, Any]:
        """Search for courses with simple parameters"""
        try:
            url = "https://udemy-paid-courses-for-free-api.p.rapidapi.com/rapidapi/courses/search"
            
            # Simple parameters matching the curl request format
            params = {
                "page": page,
                "page_size": page_size,
                "query": query
            }
            
            headers = {
                'x-rapidapi-host': 'udemy-paid-courses-for-free-api.p.rapidapi.com',
                'x-rapidapi-key': self.rapidapi_key
            }
            
            logging.info(f"Making request to Udemy Courses API with params: {params}")
            response = requests.get(url, params=params, headers=headers)
            response.raise_for_status()
            results = response.json()
            
            return {
                "status": "success",
                "course_results": results,
                "metadata": {
                    "query": query,
                    "page": page,
                    "page_size": page_size,
                    "timestamp": datetime.now().isoformat()
                }
            }
            
        except requests.exceptions.RequestException as e:
            return {
                "status": "error",
                "message": f"API request failed: {str(e)}",
                "courses": []
            }
        except Exception as e:
            return {
                "status": "error",
                "message": f"Unexpected error: {str(e)}",
                "courses": []
            }

    def build_tools(self) -> Sequence[Tool]:
        """Build and return the Udemy course search tools"""
        tools = [
            Tool(
                name="search_courses",
                description="""
                Search for free Udemy courses.
                Parameters:
                - query: Course topic to search for (required)
                - page: Page number (default: 1)
                - page_size: Number of courses per page (default: 10)
                
                Example usage:
                search_courses("python")
                search_courses("javascript", 2, 20)
                """,
                func=self.search_courses,
            )
        ]
        return tools
