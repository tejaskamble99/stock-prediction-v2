import json
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .lstm_prediction import lstm_prediction

# --- AUTH APIs (For React) ---

@csrf_exempt
def api_signup(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            
            # 1. Check if user exists
            if User.objects.filter(username=email).exists():
                return JsonResponse({"error": "Email is already taken"}, status=400)
            
            # 2. Create User (Simplified without email activation for now)
            user = User.objects.create_user(email, email, password)
            user.save()
            
            return JsonResponse({"message": "Account created successfully! Please Login."})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "POST method required"}, status=405)


@csrf_exempt
def api_login(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            
            # 1. Authenticate
            user = authenticate(username=email, password=password)
            
            if user is not None:
                login(request, user)
                return JsonResponse({"message": "Login Success", "username": user.username})
            else:
                return JsonResponse({"error": "Invalid Credentials"}, status=400)
                
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "POST method required"}, status=405)


# --- PREDICTION API (For React) ---

def search_api(request, se, stock_symbol):
    try:
        # 1. Run the prediction logic
        json_data = lstm_prediction(se, stock_symbol)
        
        # 2. Ensure data is valid JSON object
        if isinstance(json_data, str):
            data = json.loads(json_data)
        else:
            data = json_data
            
        return JsonResponse(data, safe=False)
        
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)