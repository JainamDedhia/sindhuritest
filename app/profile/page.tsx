"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit2,
  Save,
  X,
  ShoppingBag,
  Heart,
  Package,
} from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  dateOfBirth: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    dateOfBirth: "",
  });

  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=/profile");
      return;
    }

    if (session?.user) {
      // Load saved profile from localStorage or use session data
      const savedProfile = localStorage.getItem("user_profile");
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        setProfile(parsed);
        setEditedProfile(parsed);
      } else {
        const initialProfile = {
          name: session.user.name || "",
          email: session.user.email || "",
          phone: "",
          address: "",
          city: "",
          state: "",
          pincode: "",
          dateOfBirth: "",
        };
        setProfile(initialProfile);
        setEditedProfile(initialProfile);
      }
    }
  }, [session, status, router]);

  const handleSave = () => {
    setLoading(true);
    // Save to localStorage (in real app, save to database)
    localStorage.setItem("user_profile", JSON.stringify(editedProfile));
    setProfile(editedProfile);
    setIsEditing(false);
    setLoading(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleChange = (field: keyof UserProfile, value: string) => {
    setEditedProfile({ ...editedProfile, [field]: value });
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[var(--color-gold-primary)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-5xl px-4">
        
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your account information
            </p>
          </div>
          
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 rounded-lg bg-[var(--color-gold-primary)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--color-gold-accent)]"
            >
              <Edit2 size={16} />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                <X size={16} />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2 rounded-lg bg-[var(--color-gold-primary)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--color-gold-accent)] disabled:opacity-50"
              >
                <Save size={16} />
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          
          {/* Left Sidebar - Quick Stats */}
          <div className="space-y-6">
            
            {/* Profile Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-[var(--color-gold-primary)]/10">
                {session?.user?.image ? (
                  <img
                    src={session.user.image}
                    alt="Profile"
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-[var(--color-gold-primary)]" />
                )}
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                {profile.name || "Guest User"}
              </h2>
              <p className="mt-1 text-sm text-gray-500">{profile.email}</p>
              
              <div className="mt-6 flex justify-center gap-4">
                <button
                  onClick={() => router.push("/wishlist")}
                  className="flex flex-col items-center gap-1 rounded-lg border border-gray-200 px-6 py-3 transition hover:bg-gray-50"
                >
                  <Heart size={20} className="text-red-500" />
                  <span className="text-xs font-medium text-gray-600">Wishlist</span>
                </button>
                <button
                  onClick={() => router.push("/cart")}
                  className="flex flex-col items-center gap-1 rounded-lg border border-gray-200 px-6 py-3 transition hover:bg-gray-50"
                >
                  <ShoppingBag size={20} className="text-[var(--color-gold-primary)]" />
                  <span className="text-xs font-medium text-gray-600">Cart</span>
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
                Quick Links
              </h3>
              <div className="space-y-2">
                {[
                  { icon: Package, label: "My Orders", href: "/orders" },
                  { icon: Heart, label: "Wishlist", href: "/wishlist" },
                  { icon: ShoppingBag, label: "Shopping Cart", href: "/cart" },
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => router.push(item.href)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
                  >
                    <item.icon size={18} className="text-gray-400" />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - Profile Details */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h3 className="mb-6 text-lg font-semibold text-gray-900">
                Personal Information
              </h3>

              <div className="space-y-6">
                
                {/* Name */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                    <User size={16} />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={isEditing ? editedProfile.name : profile.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    disabled={!isEditing}
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition focus:border-[var(--color-gold-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-primary)]/20 disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Mail size={16} />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500"
                  />
                  <p className="mt-1 text-xs text-gray-400">
                    Email cannot be changed
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Phone size={16} />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={isEditing ? editedProfile.phone : profile.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    disabled={!isEditing}
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition focus:border-[var(--color-gold-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-primary)]/20 disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Calendar size={16} />
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={isEditing ? editedProfile.dateOfBirth : profile.dateOfBirth}
                    onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                    disabled={!isEditing}
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition focus:border-[var(--color-gold-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-primary)]/20 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                    <MapPin size={16} />
                    Street Address
                  </label>
                  <textarea
                    value={isEditing ? editedProfile.address : profile.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    disabled={!isEditing}
                    rows={3}
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition focus:border-[var(--color-gold-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-primary)]/20 disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="House no, Street, Area"
                  />
                </div>

                {/* City, State, Pincode */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <input
                      type="text"
                      value={isEditing ? editedProfile.city : profile.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      disabled={!isEditing}
                      className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition focus:border-[var(--color-gold-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-primary)]/20 disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      State
                    </label>
                    <input
                      type="text"
                      value={isEditing ? editedProfile.state : profile.state}
                      onChange={(e) => handleChange("state", e.target.value)}
                      disabled={!isEditing}
                      className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition focus:border-[var(--color-gold-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-primary)]/20 disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Pincode
                    </label>
                    <input
                      type="text"
                      value={isEditing ? editedProfile.pincode : profile.pincode}
                      onChange={(e) => handleChange("pincode", e.target.value)}
                      disabled={!isEditing}
                      className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition focus:border-[var(--color-gold-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-primary)]/20 disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="XXXXXX"
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}