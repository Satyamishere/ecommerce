# include <bits/stdc++.h>
# include <stdio.h>
#include <iostream>
#include <vector>
using namespace std;



bool func(vector<int>a,int &k){
    int water=1;
    int initial=a[k-1];
    sort(a.begin(),a.end());
    int idx=0;
    for(int i=0;i<a.size();i++){
        if(a[i]==initial){
            idx=i;
            break;
        }
    }
    bool flag=true;
    for(idx;idx<a.size()-1;idx++){
        int time=water+a[idx+1]-a[idx];
        if(time-1<=a[idx]  && time <=a[idx+1] ){
            water=water+time;
        }
        else{
            flag=false;
        }
    }
    
    
    return flag;
}


int main(){
    int t;
    cin>>t;
    while(t>0){
        int n;
        int k;
        cin>>n>>k;
        vector<int>a;
        int maxi=-1e9;
        for(int i=0;i<n;i++){
            int temp;
            cin>>temp;
            maxi=max(maxi,temp);
            a.push_back(temp);
        }
        int ans=func(a,k);
        if(ans==true){
            cout<< "Yes" << endl;
        }
        else{
            cout<< "No" << endl;
        }
        
        t--;
    }
}