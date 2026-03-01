import sys
import os

# Add your project directory to the sys.path
project_home = '/home/yourusername/FitnessNavigator/FitnessNavigator'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Load environment variables
from dotenv import load_dotenv
project_folder = os.path.expanduser(project_home)
load_dotenv(os.path.join(project_folder, '.env'))

# Import the Flask app
from app import app as application
