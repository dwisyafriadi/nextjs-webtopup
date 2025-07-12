#!/bin/bash
# fix-use-client.sh - Script untuk memperbaiki semua 'use client' directives

echo "🔧 Fixing 'use client' directives..."

# Daftar file yang perlu diperbaiki
files=(
    "app/page.tsx"
    "app/(auth)/login/page.tsx"
    "app/(auth)/register/page.tsx"
    "app/(dashboard)/topup/page.tsx"
    "app/(dashboard)/ppob/page.tsx"
    "app/(dashboard)/history/page.tsx"
    "app/(dashboard)/profile/page.tsx"
    "components/auth/login-form.tsx"
    "components/auth/register-form.tsx"
    "components/dashboard/header.tsx"
    "components/dashboard/sidebar.tsx"
    "components/dashboard/balance-card.tsx"
    "components/dashboard/quick-actions.tsx"
    "components/dashboard/recent-transactions.tsx"
    "components/dashboard/promo-card.tsx"
    "components/topup/amount-selector.tsx"
    "components/topup/payment-method-selector.tsx"
    "components/topup/topup-summary.tsx"
    "components/topup/payment-dialog.tsx"
    "components/ppob/category-list.tsx"
    "components/ppob/provider-list.tsx"
    "components/ppob/product-list.tsx"
    "components/ppob/transaction-form.tsx"
    "components/history/transaction-list.tsx"
    "components/history/topup-history-list.tsx"
    "components/history/transaction-detail.tsx"
    "components/providers/auth-provider.tsx"
    "components/ui/toaster.tsx"
    "components/ui/dialog.tsx"
)

# Function untuk fix directive
fix_directive() {
    local file=$1
    
    if [ -f "$file" ]; then
        echo "📝 Processing: $file"
        
        # Buat temporary file
        temp_file=$(mktemp)
        
        # Hapus semua bentuk directive yang salah
        sed -i.bak -e 's/^("use client");//g' \
                   -e 's/^'\''use client'\'';//g' \
                   -e 's/^"use client";//g' \
                   -e '/^[[:space:]]*$/d' "$file"
        
        # Check apakah file menggunakan hooks
        if grep -q "useState\|useEffect\|useRouter\|useForm\|use[A-Z]" "$file"; then
            # Tambahkan 'use client' di awal file
            echo "'use client';" > "$temp_file"
            echo "" >> "$temp_file"
            cat "$file" >> "$temp_file"
            mv "$temp_file" "$file"
        else
            rm "$temp_file"
        fi
        
        # Hapus backup file
        rm -f "${file}.bak"
        
        echo "✅ Fixed: $file"
    fi
}

# Process semua file
for file in "${files[@]}"; do
    fix_directive "$file"
done

echo ""
echo "✨ All 'use client' directives have been fixed!"
echo "🚀 Try running 'npm run dev' again"