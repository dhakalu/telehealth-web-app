import axios from "axios";
import { useEffect, useState } from "react";
import { useToast } from "~/hooks/useToast";
import OrganizationAddressForm from "./OrganizationAddressForm";
import OrganizationContactForm from "./OrganizationContactForm";
import OrganizationForm from "./OrganizationForm";
import OrganizationLicenseForm from "./OrganizationLicenseForm";
import OrganizationRelationshipForm from "./OrganizationRelationshipForm";
import PractitionerOrganizationForm from "./PractitionerOrganizationForm";
import {
    Organization,
    OrganizationAddress,
    OrganizationContact,
    OrganizationLicense,
    OrganizationRelationship,
    PractitionerOrganization
} from "./types";

interface OrganizationManagementProps {
    baseUrl: string;
    organizationId?: string; // Optional, if editing an existing organization
    onOrganizationCreated?: (organization: Organization) => void;
}

type TabType = "organization" | "addresses" | "contacts" | "licenses" | "practitioners" | "relationships";

export default function OrganizationManagement({
    baseUrl,
    organizationId,
    onOrganizationCreated,
}: OrganizationManagementProps) {
    const toast = useToast();
    const [activeTab, setActiveTab] = useState<TabType>("organization");
    const [loading, setLoading] = useState(false);

    const [organization, setOrganization] = useState<Organization | null>(null);
    const [addresses, setAddresses] = useState<OrganizationAddress[]>([]);
    const [contacts, setContacts] = useState<OrganizationContact[]>([]);
    const [licenses, setLicenses] = useState<OrganizationLicense[]>([]);
    const [practitioners, setPractitioners] = useState<PractitionerOrganization[]>([]);
    const [relationships, setRelationships] = useState<OrganizationRelationship[]>([]);

    // Fetch organization details when organizationId is provided
    useEffect(() => {
        if (organizationId && !loading) {
            fetchOrganizationData();
        }
    }, [organizationId]); // eslint-disable-line react-hooks/exhaustive-deps

    const fetchOrganizationData = async () => {
        if (!organizationId) return;

        setLoading(true);
        try {
            // Fetch organization details
            const orgResponse = await axios.get(`${baseUrl}/organizations/${organizationId}`);
            setOrganization(orgResponse.data);

            // Fetch addresses
            const addressResponse = await axios.get(`${baseUrl}/organizations/${organizationId}/addresses`);
            setAddresses(addressResponse.data || []);

            // Fetch contacts
            const contactResponse = await axios.get(`${baseUrl}/organizations/${organizationId}/contacts`);
            setContacts(contactResponse.data || []);

            // Fetch licenses
            const licenseResponse = await axios.get(`${baseUrl}/organizations/${organizationId}/licenses`);
            setLicenses(licenseResponse.data || []);

            // Fetch practitioners
            const practitionerResponse = await axios.get(`${baseUrl}/organizations/${organizationId}/practitioners`);
            setPractitioners(practitionerResponse.data || []);

            // Fetch relationships (both as parent and child)
            const parentRelationships = await axios.get(`${baseUrl}/organizations/${organizationId}/children`);
            const childRelationships = await axios.get(`${baseUrl}/organizations/${organizationId}/parents`);
            setRelationships([...(parentRelationships.data || []), ...(childRelationships.data || [])]);

        } catch (error) {
            console.error("Failed to fetch organization data:", error);
            toast.error("Failed to load organization data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleOrganizationCreated = (newOrganization: Organization) => {
        setOrganization(newOrganization);
        if (onOrganizationCreated) {
            onOrganizationCreated(newOrganization);
        }
        // Switch to addresses tab
        setActiveTab("addresses");
    };

    const handleOrganizationUpdated = (updatedOrganization: Organization) => {
        setOrganization(updatedOrganization);
    };

    // Address handlers
    const handleAddressCreated = (newAddress: OrganizationAddress) => {
        setAddresses(prev => [...prev, newAddress]);
    };

    // TODO: Add edit functionality for addresses
    // const handleAddressUpdated = (updatedAddress: OrganizationAddress) => {
    //     setAddresses(prev => prev.map(addr => addr.id === updatedAddress.id ? updatedAddress : addr));
    // };

    const removeAddress = async (addressId: string) => {
        try {
            await axios.delete(`${baseUrl}/organization-addresses/${addressId}`);
            setAddresses(prev => prev.filter(addr => addr.id !== addressId));
            toast.success("Address removed successfully!");
        } catch (error) {
            console.error("Failed to remove address:", error);
            toast.error("Failed to remove address. Please try again.");
        }
    };

    // Contact handlers
    const handleContactCreated = (newContact: OrganizationContact) => {
        setContacts(prev => [...prev, newContact]);
    };

    // TODO: Add edit functionality for contacts
    // const handleContactUpdated = (updatedContact: OrganizationContact) => {
    //     setContacts(prev => prev.map(contact => contact.id === updatedContact.id ? updatedContact : contact));
    // };

    const removeContact = async (contactId: string) => {
        try {
            await axios.delete(`${baseUrl}/organization-contacts/${contactId}`);
            setContacts(prev => prev.filter(contact => contact.id !== contactId));
            toast.success("Contact removed successfully!");
        } catch (error) {
            console.error("Failed to remove contact:", error);
            toast.error("Failed to remove contact. Please try again.");
        }
    };

    // License handlers
    const handleLicenseCreated = (newLicense: OrganizationLicense) => {
        setLicenses(prev => [...prev, newLicense]);
    };

    // TODO: Add edit functionality for licenses
    // const handleLicenseUpdated = (updatedLicense: OrganizationLicense) => {
    //     setLicenses(prev => prev.map(license => license.id === updatedLicense.id ? updatedLicense : license));
    // };

    const removeLicense = async (licenseId: string) => {
        try {
            await axios.delete(`${baseUrl}/organization-licenses/${licenseId}`);
            setLicenses(prev => prev.filter(license => license.id !== licenseId));
            toast.success("License removed successfully!");
        } catch (error) {
            console.error("Failed to remove license:", error);
            toast.error("Failed to remove license. Please try again.");
        }
    };

    // Practitioner relationship handlers
    const handlePractitionerRelationshipCreated = (newRelationship: PractitionerOrganization) => {
        setPractitioners(prev => [...prev, newRelationship]);
    };

    // TODO: Add edit functionality for practitioner relationships
    // const handlePractitionerRelationshipUpdated = (updatedRelationship: PractitionerOrganization) => {
    //     setPractitioners(prev => prev.map(rel => rel.id === updatedRelationship.id ? updatedRelationship : rel));
    // };

    const removePractitionerRelationship = async (relationshipId: string) => {
        try {
            await axios.delete(`${baseUrl}/practitioner-organizations/${relationshipId}`);
            setPractitioners(prev => prev.filter(rel => rel.id !== relationshipId));
            toast.success("Practitioner relationship removed successfully!");
        } catch (error) {
            console.error("Failed to remove practitioner relationship:", error);
            toast.error("Failed to remove practitioner relationship. Please try again.");
        }
    };

    // Organization relationship handlers
    const handleOrganizationRelationshipCreated = (newRelationship: OrganizationRelationship) => {
        setRelationships(prev => [...prev, newRelationship]);
    };

    // TODO: Add edit functionality for organization relationships
    // const handleOrganizationRelationshipUpdated = (updatedRelationship: OrganizationRelationship) => {
    //     setRelationships(prev => prev.map(rel => rel.id === updatedRelationship.id ? updatedRelationship : rel));
    // };

    const removeOrganizationRelationship = async (relationshipId: string) => {
        try {
            await axios.delete(`${baseUrl}/organization-relationships/${relationshipId}`);
            setRelationships(prev => prev.filter(rel => rel.id !== relationshipId));
            toast.success("Organization relationship removed successfully!");
        } catch (error) {
            console.error("Failed to remove organization relationship:", error);
            toast.error("Failed to remove organization relationship. Please try again.");
        }
    };

    return (
        <div className="p-6">
            <div>
                <h3 className="font-bold text-lg mb-4">
                    {organization ? `Manage Organization: ${organization.name}` : "Create Organization"}
                </h3>

                {/* Tab buttons */}
                <div className="tabs mb-4">
                    <button
                        className={`tab tab-bordered ${activeTab === "organization" ? "tab-active" : ""}`}
                        onClick={() => setActiveTab("organization")}
                    >
                        Organization {organization && <span className="ml-2 badge badge-sm badge-success">✓</span>}
                    </button>
                    <button
                        className={`tab tab-bordered ${activeTab === "addresses" ? "tab-active" : ""}`}
                        onClick={() => organization ? setActiveTab("addresses") : toast.info("Please save the organization first")}
                        disabled={!organization}
                    >
                        Addresses {addresses.length > 0 && <span className="ml-2 badge badge-sm badge-success">{addresses.length}</span>}
                    </button>
                    <button
                        className={`tab tab-bordered ${activeTab === "contacts" ? "tab-active" : ""}`}
                        onClick={() => organization ? setActiveTab("contacts") : toast.info("Please save the organization first")}
                        disabled={!organization}
                    >
                        Contacts {contacts.length > 0 && <span className="ml-2 badge badge-sm badge-success">{contacts.length}</span>}
                    </button>
                    <button
                        className={`tab tab-bordered ${activeTab === "licenses" ? "tab-active" : ""}`}
                        onClick={() => organization ? setActiveTab("licenses") : toast.info("Please save the organization first")}
                        disabled={!organization}
                    >
                        Licenses {licenses.length > 0 && <span className="ml-2 badge badge-sm badge-success">{licenses.length}</span>}
                    </button>
                    <button
                        className={`tab tab-bordered ${activeTab === "practitioners" ? "tab-active" : ""}`}
                        onClick={() => organization ? setActiveTab("practitioners") : toast.info("Please save the organization first")}
                        disabled={!organization}
                    >
                        Practitioners {practitioners.length > 0 && <span className="ml-2 badge badge-sm badge-success">{practitioners.length}</span>}
                    </button>
                    <button
                        className={`tab tab-bordered ${activeTab === "relationships" ? "tab-active" : ""}`}
                        onClick={() => organization ? setActiveTab("relationships") : toast.info("Please save the organization first")}
                        disabled={!organization}
                    >
                        Relationships {relationships.length > 0 && <span className="ml-2 badge badge-sm badge-success">{relationships.length}</span>}
                    </button>
                </div>

                {/* Organization Form */}
                <div className={activeTab === "organization" ? "block" : "hidden"}>
                    <OrganizationForm
                        baseUrl={baseUrl}
                        organizationId={organizationId}
                        onOrganizationCreated={handleOrganizationCreated}
                        onOrganizationUpdated={handleOrganizationUpdated}
                    />
                </div>

                {/* Addresses Tab */}
                <div className={activeTab === "addresses" ? "block" : "hidden"}>
                    {!organization ? (
                        <div className="alert alert-warning shadow-lg">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                <span>Please save the organization first.</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            <OrganizationAddressForm
                                baseUrl={baseUrl}
                                organizationId={organization.id}
                                onAddressCreated={handleAddressCreated}
                            />
                            <div className="mt-6">
                                <h4 className="font-semibold text-md mb-4">Existing Addresses</h4>
                                {addresses.length === 0 ? (
                                    <p className="text-gray-500">No addresses added yet.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {addresses.map(address => (
                                            <div key={address.id} className="border rounded-lg p-4 bg-white">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-medium">
                                                            {address.address_line_1}
                                                            {address.is_primary && <span className="ml-2 badge badge-sm badge-primary">Primary</span>}
                                                        </p>
                                                        {address.address_line_2 && <p className="text-sm text-gray-600">{address.address_line_2}</p>}
                                                        <p className="text-sm text-gray-600">
                                                            {address.city}, {address.state} {address.postal_code}, {address.country}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => removeAddress(address.id)}
                                                        className="btn btn-sm btn-error"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Contacts Tab */}
                <div className={activeTab === "contacts" ? "block" : "hidden"}>
                    {!organization ? (
                        <div className="alert alert-warning shadow-lg">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                <span>Please save the organization first.</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            <OrganizationContactForm
                                baseUrl={baseUrl}
                                organizationId={organization.id}
                                onContactCreated={handleContactCreated}
                            />
                            <div className="mt-6">
                                <h4 className="font-semibold text-md mb-4">Existing Contacts</h4>
                                {contacts.length === 0 ? (
                                    <p className="text-gray-500">No contacts added yet.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {contacts.map(contact => (
                                            <div key={contact.id} className="border rounded-lg p-4 bg-white">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-medium">
                                                            {contact.contact_type.charAt(0).toUpperCase() + contact.contact_type.slice(1)}: {contact.value}
                                                            {contact.is_primary && <span className="ml-2 badge badge-sm badge-primary">Primary</span>}
                                                        </p>
                                                        {contact.description && <p className="text-sm text-gray-600">{contact.description}</p>}
                                                    </div>
                                                    <button
                                                        onClick={() => removeContact(contact.id)}
                                                        className="btn btn-sm btn-error"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Licenses Tab */}
                <div className={activeTab === "licenses" ? "block" : "hidden"}>
                    {!organization ? (
                        <div className="alert alert-warning shadow-lg">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                <span>Please save the organization first.</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            <OrganizationLicenseForm
                                baseUrl={baseUrl}
                                organizationId={organization.id}
                                onLicenseCreated={handleLicenseCreated}
                            />
                            <div className="mt-6">
                                <h4 className="font-semibold text-md mb-4">Existing Licenses</h4>
                                {licenses.length === 0 ? (
                                    <p className="text-gray-500">No licenses added yet.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {licenses.map(license => (
                                            <div key={license.id} className="border rounded-lg p-4 bg-white">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-medium">
                                                            {license.license_type.charAt(0).toUpperCase() + license.license_type.slice(1)} License: {license.license_number}
                                                            <span className={`ml-2 badge badge-sm ${license.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                                                                {license.status}
                                                            </span>
                                                        </p>
                                                        <p className="text-sm text-gray-600">Issued by: {license.issuing_authority}</p>
                                                        {license.expiration_date && (
                                                            <p className="text-sm text-gray-600">
                                                                Expires: {new Date(license.expiration_date).toLocaleDateString()}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => removeLicense(license.id)}
                                                        className="btn btn-sm btn-error"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Practitioners Tab */}
                <div className={activeTab === "practitioners" ? "block" : "hidden"}>
                    {!organization ? (
                        <div className="alert alert-warning shadow-lg">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                <span>Please save the organization first.</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            <PractitionerOrganizationForm
                                baseUrl={baseUrl}
                                organizationId={organization.id}
                                onRelationshipCreated={handlePractitionerRelationshipCreated}
                            />
                            <div className="mt-6">
                                <h4 className="font-semibold text-md mb-4">Existing Practitioner Relationships</h4>
                                {practitioners.length === 0 ? (
                                    <p className="text-gray-500">No practitioner relationships added yet.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {practitioners.map(practitioner => (
                                            <div key={practitioner.id} className="border rounded-lg p-4 bg-white">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-medium">
                                                            Practitioner ID: {practitioner.practitioner_id}
                                                            {practitioner.is_primary && <span className="ml-2 badge badge-sm badge-primary">Primary</span>}
                                                        </p>
                                                        {practitioner.role && <p className="text-sm text-gray-600">Role: {practitioner.role}</p>}
                                                        {practitioner.start_date && (
                                                            <p className="text-sm text-gray-600">
                                                                Start Date: {new Date(practitioner.start_date).toLocaleDateString()}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => removePractitionerRelationship(practitioner.id)}
                                                        className="btn btn-sm btn-error"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Relationships Tab */}
                <div className={activeTab === "relationships" ? "block" : "hidden"}>
                    {!organization ? (
                        <div className="alert alert-warning shadow-lg">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                <span>Please save the organization first.</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            <OrganizationRelationshipForm
                                baseUrl={baseUrl}
                                parentOrganizationId={organization.id}
                                onRelationshipCreated={handleOrganizationRelationshipCreated}
                            />
                            <div className="mt-6">
                                <h4 className="font-semibold text-md mb-4">Existing Organization Relationships</h4>
                                {relationships.length === 0 ? (
                                    <p className="text-gray-500">No organization relationships added yet.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {relationships.map(relationship => (
                                            <div key={relationship.id} className="border rounded-lg p-4 bg-white">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-medium">
                                                            {relationship.relationship_type.charAt(0).toUpperCase() + relationship.relationship_type.slice(1)} Relationship
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            Parent: {relationship.parent_organization_id}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            Child: {relationship.child_organization_id}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => removeOrganizationRelationship(relationship.id)}
                                                        className="btn btn-sm btn-error"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
